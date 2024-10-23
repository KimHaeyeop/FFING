import os
import requests
from dotenv import load_dotenv
import pandas as pd
import re
from io import BytesIO
from bs4 import BeautifulSoup
import holidays
from datetime import datetime, timedelta

# 우리나라의 공휴일 리스트를 가져오기 위한 설정
kr_holidays = holidays.KR()

# .env 파일 경로 설정 및 로딩
load_dotenv(dotenv_path=os.path.join((os.getcwd()), '.env'))

# API 키 정보
FINLIFE_API_KEY = os.getenv('FINLIFE_API_KEY')
KOREA_INVEST_API_KEY = os.getenv('KOREA_INVEST_API_KEY')
KOREA_INVEST_SECRET = os.getenv('KOREA_INVEST_SECRET')

# API 요청 주소
FINLIFE_BASE_URL = 'http://finlife.fss.or.kr/finlifeapi/'
DEPOSIT_SEARCH_URL = FINLIFE_BASE_URL + 'depositProductsSearch.json'
SAVING_SEARCH_URL = FINLIFE_BASE_URL + 'savingProductsSearch.json'
KOREA_INVEST_BASE_URL = 'https://openapi.koreainvestment.com:9443'

# 조정을 통해 데이터셋을 추가로 불러올 수 있음
finlife_params = {
    'auth': FINLIFE_API_KEY,
    'topFinGrpNo': '020000',  # 은행
    'pageNo': 1,
}

# 은행명 - 은행코드
bank_code_map = {
    '한국은행': '001',
    '산업은행': '002',
    '기업은행': '003',
    '국민은행': '004',
    '하나은행': '005',
    '우리은행': '006',
    '신한은행': '007',
    '농협은행': '008',
    '수협은행': '009',
    'SC제일은행': '010',
    '씨티은행': '011',
    '케이뱅크': '012',
    '카카오뱅크': '013',
    '토스뱅크': '014',
    '저축은행': '015',
    '새마을금고': '016',
    '신협': '017',
    '우체국': '018',
    '미래에셋증권': '019',
    '삼성증권': '020',
    'NH투자증권': '021',
    '한국투자증권': '022',
    'KB증권': '023',
    '키움증권': '024'
}


def is_trading_day(date):
    """해당 날짜가 거래일인지 확인하는 함수 (공휴일 및 주말 제외)"""
    # 주말 또는 공휴일인지 확인
    return date.weekday() < 5 and date not in kr_holidays


def get_last_trading_day(date):
    """입력받은 날짜로부터 가장 가까운 이전 거래일을 반환하는 함수"""
    while not is_trading_day(date):
        date -= timedelta(days=1)  # 이전 날짜로 이동
    return date.strftime("%Y%m%d")  # YYYYMMDD 형식으로 반환


def get_deposit_products():
    """은행의 정기예금상품을 가져오는 함수"""
    response = requests.get(DEPOSIT_SEARCH_URL, params=finlife_params).json()['result']
    # {상품: 옵션} 매칭
    base_map = {
        (base['fin_prdt_cd'], base['fin_co_no']): base
        for base in response['baseList']
    }

    # 예금 상품 리스트 생성
    deposits = []
    for option in response['optionList']:
        base = base_map[(option['fin_prdt_cd'], option['fin_co_no'])]

        # 상품 정보
        product_code = base['fin_prdt_cd']
        bank_code = bank_code_map.get(base['kor_co_nm'], '000')
        bank_name = base['kor_co_nm']
        product_name = base['fin_prdt_nm']
        max_limit = base.get('max_limit')

        # 옵션 정보
        interest_rate = option['intr_rate'] if option['intr_rate'] else 0
        subscription_period = option['save_trm']

        # 예금 상품 정보 추가
        deposits.append((
            product_code[:20],
            bank_code,
            bank_name,
            product_name[:20],
            subscription_period,
            10000,  # 상품 설명에서 데이터 추출법 필요
            max_limit if max_limit else 9999999999,
            interest_rate
        ))

    return deposits


def get_saving_products():
    """은행의 적금 상품을 가져오는 함수"""
    response = requests.get(SAVING_SEARCH_URL, params=finlife_params).json()['result']
    # {상품: 옵션} 매칭
    base_map = {
        (base['fin_prdt_cd'], base['fin_co_no']): base
        for base in response['baseList']
    }

    # 적금 상품 리스트 생성
    savings = []
    for option in response['optionList']:
        base = base_map[(option['fin_prdt_cd'], option['fin_co_no'])]

        # 상품 정보
        product_code = base['fin_prdt_cd']
        bank_code = bank_code_map.get(base['kor_co_nm'], '000')
        bank_name = base['kor_co_nm']
        product_name = base['fin_prdt_nm']
        max_limit = base.get('max_limit')

        # 옵션 정보
        subscription_period = option['save_trm']
        interest_rate = option['intr_rate']

        # 적금 상품 정보 추가
        savings.append((
            product_code[:20],
            bank_code,
            bank_name,
            product_name[:20],
            int(subscription_period),
            10000,  # 상품 설명에서 데이터 추출법 필요
            max_limit if max_limit else 1000000,
            interest_rate
        ))
    return savings


def get_stock_products(trd_date=None):
    """증권 상품을 가져오는 함수"""
    # 주식 정보 추가
    if trd_date is None:
        # 마지막 장 마감일 parsing
        url = 'https://finance.naver.com/sise/sise_index.naver?code=KOSPI'
        data = requests.get(url)
        print('마지막 장 마감일을 확인하는 중...')
        data_html = BeautifulSoup(data.content, 'lxml')  # 'lxml' 파서 지정
        parse_day = data_html.select_one('div.ly_realtime > span#time').text.split()[0]
        biz_day = re.findall('[0-9]+', parse_day)
        biz_day = ''.join(biz_day)
    else:
        # 입력받은 날짜를 기반으로 거래일 계산
        biz_day = get_last_trading_day(trd_date)  # 입력 날짜에 대해 장 마감일 계산

    # 주식 정보
    gen_otp_url = 'http://data.krx.co.kr/comm/fileDn/GenerateOTP/generate.cmd'  # base_url
    down_url = 'http://data.krx.co.kr/comm/fileDn/download_csv/download.cmd'  # download_url
    headers = {
        'Referer': 'http://data.krx.co.kr/contents/MDC/MDI/mdiLoader',
        # 환경에 따라 header는 상이함
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
    }

    # 전종목시세 csv 다운로드
    gen_otp_stk = {
        'mktId': 'STK',
        'trdDd': biz_day,
        'money': '1',
        'csvxls_isNo': 'false',
        'name': 'fileDown',
        'url': 'dbms/MDC/STAT/standard/MDCSTAT01501'
    }
    otp_stk = requests.post(gen_otp_url, gen_otp_stk, headers=headers).text  # otp 발급
    down_sector_stk = requests.post(down_url, {'code': otp_stk}, headers=headers)  # csv_download
    sector_stk = pd.read_csv(BytesIO(down_sector_stk.content), encoding='EUC-KR')

    return sector_stk
