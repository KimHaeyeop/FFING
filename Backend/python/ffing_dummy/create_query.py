import mysql.connector
from dateutil.relativedelta import relativedelta
from datetime import time, datetime, timedelta
from faker import Faker
import random
import os
import numpy as np
from dotenv import load_dotenv
from . import fetch_finance_product
import requests

# 금융결제원 api 요청 기본 URL
OPENBANK_BASE_URL = 'https://testapi.openbanking.or.kr'

load_dotenv(dotenv_path=os.path.join((os.getcwd()), '.env'))
fake = Faker('ko_KR')

# MySQL 연결 설정
db = mysql.connector.connect(
    host="localhost",
    user="root",
    password=os.getenv('MY_SQL_PASSWORD'),
    database="ffing_db"
)
cursor = db.cursor()

# 거래 종류에 따라 거래 이름을 가져오는 딕셔너리
transaction_type_map = {
    "1": "입금(이체)",
    "2": "출금(이체)",
}

# 증권사 코드를 담은 딕셔너리
security_code_map = {
    '261': '교보증권',
    '267': '대신증권',
    '287': '메리츠증권',
    '238': '미래에셋증권',
    '290': '부국증권',
    '240': '삼성증권',
    '291': '신영증권',
    '278': '신한금융투자',
    '209': '유안타증권',
    '280': '유진투자증권',
    '288': '카카오페이증권',
    '264': '키움증권',
    '271': '토스증권',
    '294': '펀드온라인코리아',
    '270': '하나금융투자',
    '262': '하이투자증권',
    '243': '한국투자증권',
    '269': '한화투자증권',
    '263': '현대차증권',
    '279': 'DB금융투자',
    '218': 'KB증권',
    '227': 'KTB투자증권(다올투자증권)',
    '292': 'LIG투자증권',
    '247': 'NH투자증권',
    '266': 'SK증권'
}

# 지출 카테고리
spending_categories = ['FOOD_BAKERY', 'TRANSPORTATION', 'SHOPPING', 'LIFE_CULTURE', 'FINANCE']

# 알람 종류
alarm_types = ['DAILY', 'MONTHLY', 'EVENT']

# 알람 상태
alarm_statuses = ['WARNING', 'CAUTION', 'CHECK', 'ADVICE']

# 알람
alarms = [
    ('20240901', '08:00', 'DAILY', '지출 알림', '📉 나야..핑! 오늘 지출이 얼마나 될지 확인해보자!', 'WARNING', 0),
    ('20240901', '14:00', 'MONTHLY', '정기 결제 알림', '⚡ 정기 결제의 날! 이번 달에는 어떤 것들이 들어왔을까?', 'CAUTION', 0),
    ('20240905', '09:45', 'EVENT', '큰 지출 알림', '💸 큰 지출이 발생했습니다! 예상 외의 비용이 나갔네요. 주의가 필요합니다!', 'WARNING', 0),
    ('20240907', '10:30', 'DAILY', '지출 알림', '💳 이번 주 지출이 괜찮을까? 한 번 점검해보세요!', 'WARNING', 0),
    ('20240907', '15:00', 'MONTHLY', '자산 현황', '📊 자산 현황을 체크해보세요! 저번 주보다 얼마나 늘었나요?', 'CHECK', 0),
    ('20240909', '13:15', 'EVENT', '지출 초과 경고', '⚠️ 예상보다 많은 지출이 발생했습니다! 계획을 다시 세워보는 건 어떨까요?', 'WARNING', 0),
    ('20240910', '11:00', 'DAILY', '핑알림', '👀 오늘의 지출 상한은 얼마인가요? 나만 믿고 함께 가보아요!', 'ADVICE', 0),
    ('20240912', '14:45', 'EVENT', '특별 보너스', '🎉 축하합니다! 예상치 못한 보너스가 들어왔습니다. 재정 계획을 조정하세요!', 'CHECK', 0),
    ('20240914', '09:15', 'DAILY', '지출 알림', '👀 오늘의 지출은 어떤가요? 주의가 필요해요!', 'WARNING', 0),
    ('20240914', '12:45', 'MONTHLY', '정기 결제 알림', '🛒 정기 결제의 시간이 돌아왔습니다! 이번 달은 어떤 항목이 있을까요?', 'CAUTION', 0),
    ('20240915', '14:00', 'EVENT', '큰 지출 알림', '💔 예상치 못한 큰 지출이 발생했습니다. 꼭 체크하세요!', 'WARNING', 0),
    ('20240917', '17:30', 'EVENT', '저축 기념 알림', '🐷 오늘은 저축 기념일! 새로운 목표를 설정해보는 건 어떨까요?', 'ADVICE', 0),
    ('20240918', '08:30', 'DAILY', '아침 알림', '🌞 좋은 아침입니다! 오늘도 알찬 하루를 위해 지출을 신경 써보세요!', 'CHECK', 0),
    ('20240920', '09:45', 'EVENT', '큰 지출 알림', '⚠️ 큰 지출이 있었습니다! 재정 계획을 다시 점검해보세요! 💰', 'WARNING', 0),
    ('20240921', '11:20', 'DAILY', '지출 알림', '💳 이번 주 지출을 마무리! 나의 소비 패턴은 어떤지 점검해보세요.', 'WARNING', 0),
    ('20240921', '13:30', 'MONTHLY', '자산 현황', '📈 자산의 변화가 있었는지 확인해보세요. 새로운 기회가 올지도!', 'CHECK', 0),
    ('20240923', '19:00', 'EVENT', '특별 저녁 알림', '🍽️ 저녁 약속이 생겼나요? 오늘 저녁은 특별한 날! 지출을 신경 써보세요!', 'ADVICE', 0),
    ('20240925', '09:00', 'DAILY', '아침 핑알림', '☕ 아침 커피와 함께 오늘의 지출 계획을 세워보세요!', 'CHECK', 0),
    ('20240926', '13:45', 'EVENT', '급작스러운 지출 알림', '⚡ 예상치 못한 지출이 발생했습니다. 너무 놀라지 마세요, 잘 해결할 수 있습니다!', 'CAUTION', 0),
    ('20240928', '17:00', 'DAILY', '지출 알림', '💥 오늘은 어떤 지출이 기다리고 있을까요? 예산을 잘 관리하세요!', 'WARNING', 0),
    ('20240928', '16:00', 'MONTHLY', '정기 결제 알림', '📝 정기 결제 날짜가 돌아왔습니다. 이번 달은 어떤 것들이 포함되었나요?', 'CAUTION', 0),
    ('20240929', '20:30', 'EVENT', '가을 세일 알림', '🍂 가을 세일 시즌이 다가왔습니다! 필요하지 않은 지출을 자제하는 것도 방법이에요!', 'ADVICE', 0),
    ('20241001', '12:00', 'DAILY', '지출 상한 경고', '🚨 지출 상한에 가까워지고 있어요! 주의가 필요합니다.', 'WARNING', 0),
    ('20241002', '15:30', 'EVENT', '긴급 알림', '🚨 큰 지출이 발생했습니다! 예산을 다시 점검해보세요!', 'WARNING', 0),
    ('20241005', '09:10', 'DAILY', '지출 계획 점검', '🔍 주말입니다! 이번 주 지출 계획을 점검해보세요.', 'CHECK', 0),
    ('20241007', '10:45', 'EVENT', '갑작스러운 지출 발생', '💥 갑작스러운 지출이 발생했습니다! 신중하게 처리하세요.', 'WARNING', 0),
    ('20241009', '17:45', 'EVENT', '저녁 알림', '🍽️ 오늘 저녁에는 어떤 계획이 있나요? 지출을 미리 관리하는 것도 좋겠네요!', 'ADVICE', 0),
    ('20241010', '08:30', 'DAILY', '아침 핑알림', '🌅 좋은 아침입니다! 오늘 하루도 현명한 지출을 계획하세요!', 'CHECK', 0),
]

# 펫 목록
pet_list = [
    (1, '001', '주황색 달곰', 'pets/bear-brown.png'),
    (2, '002', '라임색 달곰', 'pets/bear-lime.png'),
    (3, '003', '화이트 캔디 플러프', 'pets/candy-fluff-white.png'),
    (4, '004', '옐로 캔디 플러프', 'pets/candy-fluff-yellow.png'),
    (5, '005', '검정색 고양이', 'pets/cat-black.png'),
    (6, '006', '파란색 고양이', 'pets/cat-blue.png'),
    (7, '007', '시안색 고양이', 'pets/cat-cyan.png'),
    (8, '008', '초록색 고양이', 'pets/cat-green.png'),
    (9, '009', '핑크색 고양이', 'pets/cat-pink.png'),
    (10, '010', '빨간색 고양이', 'pets/cat-red.png'),
    (11, '011', '보라색 고양이', 'pets/cat-violet.png'),
    (12, '012', '노란색 고양이', 'pets/cat-yellow.png'),
    (13, '013', '치이카와', 'pets/chiikawa.png'),
    (14, '014', '컴퓨터', 'pets/computer.png'),
    (15, '015', '쿠키 블로섬', 'pets/cookie-blossom.png'),
    (16, '016', '게', 'pets/crab.png'),
    (17, '017', '오리', 'pets/duck.png'),
    (18, '018', '에그 차일드', 'pets/egg-child.png'),
    (19, '019', '여우', 'pets/fox.png'),
    (20, '020', '유령', 'pets/ghost.png'),
    (21, '021', '아랍 남자', 'pets/man-arab.png'),
    (22, '022', '노인 남자', 'pets/man-old.png'),
    (23, '023', '파란색 메타몽', 'pets/metamong-blue.png'),
    (24, '024', '보라색 메타몽', 'pets/metamong-purple.png'),
    (25, '025', '버섯', 'pets/mushroom.png'),
    (26, '026', '오니', 'pets/oni.png'),
    (27, '027', '펭귄', 'pets/penguin.png'),
    (28, '028', '비둘기', 'pets/pigeon.png'),
    (29, '029', '피카츄', 'pets/pikachu.png'),
    (30, '030', '토끼', 'pets/rabbit.png'),
    (31, '031', '라쿤', 'pets/raccoon.png'),
    (32, '032', '쥐', 'pets/rat.png'),
    (33, '033', '로봇', 'pets/robot.png'),
    (34, '034', '모래두지', 'pets/sandshrew.png'),
]

# 펫 타입
pet_type_list = [
    ('001', '금융'),
    ('002', '식비'),
    ('003', '생활'),
    ('004', '쇼핑'),
    ('005', '교통'),
]

# 금융 상품 목록을 담은 딕셔너리
inserted_ids = {
    "deposit_product": [],
    "saving_product": [],
    "pet": [],
}

# 카드 발행자 정보
card_issuers = [
    ('1001', '삼성카드'),
    ('1002', '현대카드'),
    ('1003', '롯데카드'),
    ('1004', '국민카드'),
    ('1005', '신한카드'),
    ('1006', '우리카드'),
    ('1007', '하나카드')
]

# 카드 혜택 정보
card_discounts = [
    '생활 20% 할인, 교통 10% 할인, 대형마트 5% 할인',
    '영화 30% 할인, 커피 15% 할인, 쇼핑 10% 할인',
    '교통비 20% 할인, 마트 10% 할인, 외식 15% 할인',
    '여행 10% 할인, 호텔 5% 할인, 면세점 20% 할인'
]

# 은행 정보
banks = [
    ('001', '한국은행'),
    ('002', '산업은행'),
    ('003', '기업은행'),
    ('004', '국민은행'),
    ('005', '하나은행'),
    ('006', '우리은행'),
    ('007', '신한은행'),
    ('008', '농협은행'),
    ('009', '수협은행'),
    ('010', 'SC제일은행'),
    ('011', '씨티은행'),
    ('012', '케이뱅크'),
    ('013', '카카오뱅크'),
    ('014', '토스뱅크'),
    ('015', '저축은행'),
    ('016', '새마을금고'),
    ('017', '신협'),
    ('018', '우체국'),
    ('019', '미래에셋증권'),
    ('020', '삼성증권'),
    ('021', 'NH투자증권'),
    ('022', '한국투자증권'),
    ('023', 'KB증권'),
    ('024', '키움증권')
]


def insert_dashes(number_str):
    """계좌 사이에 붙임표를 삽입하는 함수"""
    positions = random.sample(range(1, len(number_str)), random.randint(1, 3))
    for pos in sorted(positions, reverse=True):
        number_str = number_str[:pos] + '-' + number_str[pos:]
    return number_str


def generate_trading_time():
    # 매매 가능 시간 범위
    start_time = time(9, 0)  # 09:00
    end_time = time(15, 30)  # 15:30

    # 시간을 초로 변환
    start_seconds = timedelta(hours=start_time.hour, minutes=start_time.minute).total_seconds()
    end_seconds = timedelta(hours=end_time.hour, minutes=end_time.minute).total_seconds()

    # 범위 내에서 랜덤한 초 생성
    random_seconds = random.randint(int(start_seconds), int(end_seconds))

    # 랜덤한 초를 시간으로 변환
    random_time = (datetime(1970, 1, 1) + timedelta(seconds=random_seconds)).time()

    return random_time.strftime('%H%M%S')


def insert_ssafy_user(username, email, uuid4, created_at):
    """싸피 사용자 데이터 생성 및 삽입"""
    query = """
    INSERT INTO ssafy_user (user_id, username, user_key, created_at)
    VALUES (%s, %s, %s, %s)
    """
    data = (
        email, username, uuid4, created_at
    )
    cursor.execute(query, data)
    db.commit()
    return cursor.lastrowid


def insert_user(username, email, birth, nickname, ssafy_user_id, created_at):
    """사용자 데이터 생성 및 삽입"""
    query = """
    INSERT INTO user (
        email,
        password,
        username,
        role,
        gender,
        birth,
        nickname,
        pin,
        created_at,
        updated_at,
        ssafy_user_id
    ) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
    """
    data = (
        email,
        '$2b$12$BlFLFM91R1W4oIRxOoTskO84mgXYkSvu9gEyZIOeeCyn3uC4f4h2O',  #Qw123456
        username,
        'USER',
        'M',
        birth,
        nickname,  # 영어 닉네임
        random.randint(100000, 999999),
        created_at,
        datetime.now(),  # 오늘 날짜로 최신화
        ssafy_user_id,
    )
    cursor.execute(query, data)
    db.commit()
    return cursor.lastrowid


def insert_account_product(num_accounts):
    """입출금 상품 생성 및 삽입"""
    data_list = []
    for _ in range(num_accounts):
        bank_code, bank_name = random.choice(banks)
        account_type_unique_no = f"{bank_code}-{random.randint(1, 9999)}-{fake.uuid4()[:8]}"
        account_name = fake.catch_phrase()[:8] + " 통장"

        data_list.append((
            account_type_unique_no,
            account_name,
            bank_code,
            bank_name
        ))
    query = """
    INSERT INTO account_product (
        account_type_unique_no,
        account_name,
        bank_code,
        bank_name
    ) VALUES (%s, %s, %s, %s)
    """
    cursor.executemany(query, data_list)
    db.commit()
    print('입출금 상품을 성공적으로 생성했습니다.')
    return


def insert_deposit_product():
    """정기 예금 상품 생성 및 삽입"""
    deposits = fetch_finance_product.get_deposit_products()  # 예금 정보 가져오기

    query = """
    INSERT INTO deposit_product (
        account_type_unique_no,
        bank_code, bank_name,
        account_name,
        subscription_period,
        min_subscription_balance,
        max_subscription_balance,
        interest_rate
    ) VALUES (%s, %s, %s, %s, %s, %s, %s, %s)
    """
    cursor.executemany(query, deposits)
    db.commit()
    print('예금 상품을 성공적으로 생성했습니다.')
    return


def insert_saving_product():
    """적금 상품 생성 및 삽입"""
    savings = fetch_finance_product.get_saving_products()  # 적금 정보 가져오기

    query = """
    INSERT INTO savings_product (
        account_type_unique_no,
        bank_code,
        bank_name,
        account_name,
        subscription_period,
        min_subscription_balance,
        max_subscription_balance,
        interest_rate
    ) VALUES (%s, %s, %s, %s, %s, %s, %s, %s)
    """
    cursor.executemany(query, savings)
    db.commit()
    print('적금 상품을 성공적으로 생성했습니다.')
    return


def insert_card_product(num_cards):
    """카드 상품 생성 및 삽입"""
    data_list = []
    for _ in range(num_cards):
        card_issuer_code, card_issuer_name = random.choice(card_issuers)
        card_unique_no = f"{card_issuer_code}-{fake.uuid4()[:8]}"
        card_name = fake.catch_phrase()[:8] + ' 카드'
        card_description = random.choice(card_discounts)

        data_list.append((
            card_unique_no,
            card_issuer_code,
            card_issuer_name,
            card_name,
            card_description,
        ))

    query = """
    INSERT INTO card_product (
        card_unique_no,
        card_issuer_code,
        card_issuer_name,
        card_name,
        card_description
    ) VALUES (%s, %s, %s, %s, %s)
    """
    cursor.executemany(query, data_list)
    db.commit()
    print('카드 상품 생성을 성공적으로 완료했습니다.')
    return


def insert_account(user_id, num_accounts):
    """입출금 데이터 생성 및 삽입"""
    data_list = []
    for i in range(random.randint(1, 5)):
        # 입출금 계좌 상품 가져오기
        account_id = random.randint(1, num_accounts)

        select_query = f"""
        SELECT bank_code, account_name
        FROM account_product
        WHERE account_product_id = {account_id}
        """
        cursor.execute(select_query)
        bank_code, account_name = cursor.fetchone()

        # 거래 내역 생성하기(거래 내역을 생성해야 account_balance를 계산할 수 있으므로)
        account_balance, first_transaction_date, last_transaction_date = insert_account_transaction(i + 1)

        # 계좌번호 무작위 생성
        account_no = fake.numerify('#' * 16)  # 16자리 숫자 계좌번호

        # 만기일: 첫 거래일로부터 10년 후
        account_expiry_date = first_transaction_date + timedelta(days=365 * random.randint(5, 10))

        data_list.append((
            bank_code,
            account_name,
            account_no,
            first_transaction_date,
            account_expiry_date,
            account_balance,
            last_transaction_date,
            user_id,
            account_id
        ))
    insert_query = """
    INSERT INTO account (
        bank_code,
        account_name,
        account_no,
        account_created_date,
        account_expiry_date,
        account_balance,
        last_transaction_date,
        ssafy_user_id,
        demand_deposit_id
    ) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s)
    """
    cursor.executemany(insert_query, data_list)
    db.commit()
    return


def select_deposit_products():
    """정기 예금 상품 전체를 가져오는 함수"""
    query = """
    SELECT deposit_product_id, bank_code, account_name, subscription_period, account_type_unique_no, min_subscription_balance, max_subscription_balance
    FROM deposit_product
    """
    cursor.execute(query)
    result = cursor.fetchall()

    # 조회 결과를 inserted_ids["deposit_product"]에 저장
    inserted_ids["deposit_product"] = [
        {
            'id': row[0],
            'bank_code': row[1],
            'account_name': row[2],
            'subscription_period': row[3] if row[3] else 12,
            'account_type_unique_no': row[4],
            'min_subscription_balance': row[5],
            'max_subscription_balance': row[6]
        }
        for row in result
    ]
    return


def insert_deposit_account_with_transactions(n, ssafy_user_id):
    """정기 예금 계좌를 생성하고 거래 내역을 생성하는 함수"""
    select_deposit_products()

    data_list = []  # 계좌 생성을 위한 데이터

    for _ in range(n):
        deposit_product = random.choice(inserted_ids["deposit_product"])

        deposit_id = deposit_product['id']  # 예금 ID
        bank_code = deposit_product['bank_code']  # 은행 코드
        account_name = deposit_product['account_name']  # 예금 상품명
        account_type_unique_no = deposit_product['account_type_unique_no']  # 금융 상품 고유 식별 코드
        min_subscription_balance = int(deposit_product['min_subscription_balance'])  # 최소 납입 금액
        max_subscription_balance = int(deposit_product['max_subscription_balance'])  # 최대 납입 금액

        subscription_period = deposit_product['subscription_period']  # 만기
        join_date = fake.date_time_between(start_date=f'-{subscription_period}M', end_date='now')  # 무작위 날짜
        expiration_date = join_date + relativedelta(months=subscription_period)  # 만기일
        balance = random.randint(min_subscription_balance, max_subscription_balance)

        # 계좌 및 거래 데이터를 함께 생성
        data = (
            bank_code,
            account_name,
            insert_dashes(fake.numerify('#' * random.randint(8, 16))),
            account_type_unique_no,
            balance,
            balance,
            join_date,
            expiration_date,
            deposit_id,
            ssafy_user_id,
            join_date.strftime('%Y%m%d'),  # 거래 일자
            join_date.strftime('%H%M%S'),  # 거래 시간
            balance  # 거래 금액

        )
        data_list.append(data)

    query = """
    INSERT INTO deposit_account (
        bank_code,
        account_name,
        withdrawal_account_no,
        account_no,
        deposit_balance,
        total_balance,
        account_create_date,
        account_expiry_date,
        deposit_product_id,
        ssafy_user_id
    ) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
    """

    transaction_query = """
    INSERT INTO deposit_transaction (
        payment_date,
        payment_time,
        payment_balance,
        deposit_account_id
    ) VALUES (%s, %s, %s, LAST_INSERT_ID())
    """

    # 여러 계좌를 삽입하면서 각 계좌에 대해 거래도 동시에 삽입
    for data in data_list:
        cursor.execute(query, data[:10])  # 계좌 정보 삽입
        cursor.execute(transaction_query, data[10:])  # 거래 정보 삽입

    db.commit()
    return


def select_saving_products():
    """적금 상품 전체를 가져오는 함수"""
    query = """
    SELECT
    savings_product_id,
    account_type_unique_no,
    bank_code,
    account_name,
    subscription_period,
    min_subscription_balance,
    max_subscription_balance,
    account_type_unique_no
    FROM savings_product
    """
    cursor.execute(query)
    result = cursor.fetchall()

    # 조회 결과를 inserted_ids["deposit_product"]에 저장
    inserted_ids["saving_product"] = [
        {
            'id': row[0],
            'account_type_unique_no': row[1],
            'bank_code': row[2],
            'account_name': row[3],
            'subscription_period': row[4] if row[4] else 12,
            'min_subscription_balance': row[5],
            'max_subscription_balance': row[6]
        }
        for row in result
    ]
    return


def insert_saving_account_with_transactions(n, ssafy_user_id):
    """적금 계좌와 해당 거래 기록을 생성하는 함수"""
    select_saving_products()  # 적금 상품 조회

    data_list = []  # 계좌 및 거래 데이터 리스트

    for _ in range(n):
        saving_product = random.choice(inserted_ids["saving_product"])

        saving_id = saving_product['id']  # 적금 상품 ID
        bank_code = saving_product['bank_code']
        account_name = saving_product['account_name']
        min_balance = int(saving_product['min_subscription_balance'])
        max_balance = int(saving_product['max_subscription_balance'])
        account_type_unique_no = saving_product['account_type_unique_no']
        subscription_period = saving_product['subscription_period']

        # 가입일과 만기일 계산
        join_date = fake.date_time_between(start_date=f'-{subscription_period}M', end_date='now')
        expiration_date = join_date + relativedelta(months=subscription_period)
        now = datetime.now()

        # 적금 잔액과 총 잔액 계산
        balance = random.randint(min_balance, max_balance)
        installment_number = (now.year - join_date.year) * 12 + (now.month - join_date.month)
        total_balance = balance * max(1, installment_number) if balance * max(1,
                                                                              installment_number) < 99999999999999.00 else 100000000000

        # 계좌 정보 생성
        data = (
            bank_code,
            account_name,
            insert_dashes(fake.numerify('#' * random.randint(8, 16))),
            account_type_unique_no,
            balance,
            total_balance,
            installment_number,
            join_date,
            expiration_date,
            saving_id,
            ssafy_user_id
        )
        data_list.append(data)

        # 각 회차별 거래 정보 생성
        transactions = []
        for i in range(installment_number):
            random_time = fake.time_object()  # 랜덤 시간 객체 생성
            payment_date = join_date + relativedelta(months=i)  # 월별 납입 날짜 생성
            payment_datetime = datetime.combine(payment_date.date(), random_time)  # 기존 시간에 랜덤한 시간을 추가
            transaction = (
                payment_date.strftime("%Y%m%d"),  # YYYYMMDD 형식
                payment_datetime.strftime("%H%M%S"),  # HHMMSS 형식
                balance,  # 납입 금액
                i + 1  # 회차 번호
            )
            transactions.append(transaction)

        # 계좌 생성 후 거래 정보 삽입
        insert_saving_account_and_transactions(data, transactions)

    db.commit()


def insert_saving_account_and_transactions(account_data, transactions):
    """적금 계좌와 해당 거래를 삽입하는 함수"""
    # 적금 계좌 삽입
    query = """
    INSERT INTO savings_account (
        bank_code,
        account_name,
        withdrawal_account_no,
        account_no,
        deposit_balance,
        total_balance,
        installment_number,
        account_create_date,
        account_expiry_date,
        savings_product_id,
        ssafy_user_id
    ) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
    """
    cursor.execute(query, account_data)  # 계좌 정보 삽입

    # 거래 삽입 (LAST_INSERT_ID() 사용)
    transaction_query = """
    INSERT INTO savings_transaction (
        payment_date,
        payment_time,
        payment_balance,
        deposit_installment,
        savings_account_id
    ) VALUES (%s, %s, %s, %s, LAST_INSERT_ID())
    """
    cursor.executemany(transaction_query, transactions)  # 회차별 거래 삽입


def insert_stock_account(n, ssafy_user_id):
    """주식 계좌 생성과 거래 기록을 추가하는 함수"""
    account_list = []

    # 계좌 n개 생성
    for i in range(n):
        security_code = random.choice(list(security_code_map.keys()))  # 증권 회사 코드
        security_name = security_code_map[security_code]  # 증권회사 명

        # 거래 기록을 통해 최종 금액 계산
        total_evaluation_amount, total_purchase_amount = insert_stock_transactions(i)

        account_list.append((
            security_code,
            security_name,
            round(random.randint(total_purchase_amount, 999999999), -2),
            total_evaluation_amount,
            total_purchase_amount,
            ssafy_user_id
        ))
    # 주식 계좌 삽입
    query = """
    INSERT INTO stock_account (
        securities_company_code,
        securities_company_name,
        stock_account_balance,
        total_evaluation_amount,
        total_purchase_amount,
        ssafy_user_id
    ) VALUES (%s, %s, %s, %s, %s, %s)
    """

    cursor.executemany(query, account_list)
    db.commit()


def select_stock_products(held_stocks, target_stock_code):
    """보유 주식 코드와 수량에 따라 총 평가 금액을 계산하는 함수"""
    stock_codes = list(held_stocks.keys())
    # SQL 쿼리 문자열 형식
    query = f"""
    SELECT stock_info_id, stock_code, current_evaluation_price
    FROM stock_info
    WHERE stock_code IN ({','.join(['%s'] * len(stock_codes))})
    """

    cursor.execute(query, stock_codes)  # stock_codes를 직접 전달
    result = cursor.fetchall()

    # 총 평가 금액 계산
    stock_id = None
    total_evaluation_amount = 0
    for stock_info_id, stock_code, current_price in result:
        quantity = held_stocks[stock_code][0]  # 보유 수량
        total_evaluation_amount += current_price * quantity

        # stock_info_id 찾기
        if target_stock_code == stock_code:
            stock_id = stock_info_id

    return total_evaluation_amount, stock_id


def insert_card(ssafy_user_id, num_cards):
    """카드 데이터 생성 및 삽입"""

    data_list = []
    select_query = """
    SELECT card_issuer_code, card_name
    FROM card_product
    WHERE card_product_id = %s
    """

    insert_query = """
    INSERT INTO card (
        card_issuer_code,
        card_name,
        card_no,
        cvc,
        card_expiry_date,
        withdrawal_account_no,
        card_product_id,
        ssafy_user_id
    ) VALUES (%s, %s, %s, %s, %s, %s, %s, %s)
    """

    for i in range(5):  # 우선 1인당 카드 5개씩 할당
        # 카드 상품 가져오기
        card_id = random.randint(1, num_cards)
        cursor.execute(select_query, (card_id,))
        card_issuer_code, card_name = cursor.fetchone()
        data_list.append((
            card_issuer_code,
            card_name,
            fake.credit_card_number(card_type=None)[:16],
            fake.credit_card_security_code(card_type=None)[:3],
            fake.date_time_between(start_date='now', end_date='+5y'),
            fake.bban()[:16],
            card_id,
            ssafy_user_id
        ))
    cursor.executemany(insert_query, data_list)
    insert_card_transaction()
    db.commit()
    return


def insert_account_transaction(account_id):
    """입출금 통장 거래 생성 및 삽입"""
    data_list = []
    account_balance = 0  # 잔액
    first_transaction_date = fake.date_time_between(start_date='-5y', end_date='now')  # 첫 거래일
    last_transaction_date = first_transaction_date  # 마지막 거래일 초기화

    for _ in range(random.randint(1, 1000)):
        transaction_type = random.choice(['1', '2']) if account_balance > 1000 else '1'
        # 잔액 계산
        if transaction_type == '1':  # 입금
            transaction_balance = round(random.randint(1000, 5000000), -2)
            account_balance += transaction_balance
        else:
            transaction_balance = round(random.randint(1000, account_balance), -2)
            account_balance -= transaction_balance

        transaction_date = fake.date_time_between(start_date=first_transaction_date, end_date=datetime.now())
        last_transaction_date = transaction_date  # 마지막 거래일 최신화
        transaction_time = transaction_date.strftime('%H%M%S')
        data_list.append((
            transaction_date.strftime('%Y%m%d'),  # 거래 날짜 (YYYYMMDD)
            transaction_time,  # 거래 시간 (HHMMSS)
            transaction_type,  # 입출금 유형
            '입금' if transaction_type == '1' else '출금',  # 거래 유형명
            fake.numerify('#' * 16),  # 거래 계좌번호
            transaction_balance,  # 거래 금액
            account_balance,  # 거래 후 잔액
            fake.company(),  # 거래 요약
            fake.bs(),  # 거래 메모
            account_id  # 계좌 ID
        ))
    query = """
    INSERT INTO account_transaction (
        transaction_date,
        transaction_time,
        transaction_type,
        transaction_type_name,
        transaction_account_no,
        transaction_balance,
        transaction_after_balance,
        transaction_summary,
        transaction_memo,
        account_id
    ) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
    """
    cursor.executemany(query, data_list)
    db.commit()
    return account_balance, first_transaction_date, last_transaction_date


def insert_card_transaction():
    """카드 거래 데이터 생성 및 삽입하는 함수"""
    data_list = []
    query = """
    INSERT INTO card_transaction (
        category,
        merchant,
        transaction_date,
        transaction_time,
        payment_balance,
        card_id
    ) VALUES (%s, %s, %s, %s, %s, %s)
    """
    first_transaction = fake.date_time_between(start_date='-5y', end_date='now')
    previous_date = first_transaction
    for _ in range(random.randint(1, 1000)):
        transaction_date = fake.date_time_between(start_date=previous_date, end_date='now')
        previous_date = transaction_date
        data_list.append((
            random.choice(spending_categories),
            fake.company(),
            transaction_date.strftime('%Y%m%d'),
            transaction_date.strftime('%H%M%S'),
            round(random.randint(1000, 99999999), -2),
            random.randint(1, 5),  # 한 사람 앞에 우선 카드 5개씩 할당
        ))
    cursor.executemany(query, data_list)
    db.commit()
    return


def insert_stock_info():
    """주식 종목 정보를 추가하는 함수"""
    stocks = fetch_finance_product.get_stock_products()
    # 필요한 열만 추출하여 튜플로 변환
    stock_data = stocks[['종목코드', '종목명', '종가']].apply(tuple, axis=1).tolist()

    query = """
    INSERT INTO stock_info (
        stock_code,
        stock_name,
        current_evaluation_price
    ) VALUES (%s, %s, %s)
    """
    cursor.executemany(query, stock_data)
    db.commit()
    print('증권 정보를 성공적으로 생성했습니다.')
    return


def insert_stock_transactions(stock_account_id):
    """주식 거래 기록 생성 및 잔액 계산"""
    total_purchase_amount = 0  # 총 매입 금액
    total_evaluation_amount = 0  # 총 평가 금액
    held_stocks = {}  # 현재 보유 주식
    data_list = []

    previous_date = datetime.now() - timedelta(days=365)  # 초기 날짜
    # 주식 거래 기록 무작위 선택
    for _ in range(random.randint(1, 10)):
        transaction_type = random.choice([1, 2]) if held_stocks else 1  # 1: 매수, 2: 매도
        # 순차적 데이터 생성
        target_date = fake.date_between(start_date=previous_date, end_date='now')
        previous_date = target_date  # 날짜 갱신

        # 매수 시
        if transaction_type == 1:
            stock = fetch_finance_product.get_stock_products(target_date).sample()  # 특정 날짜 주식 데이터
            stock_code = str(stock['종목코드'].values[0])  # 주식 코드
            closing_price = int(stock['종가'].values[0]) if not np.isnan(stock['종가'].values[0]) else 0  # 종가
            quantity = random.randint(1, 1000)  # 거래 수량
            current_quantity, _ = held_stocks.get(stock_code, (0, 0))  # 우연한 추가 매수는 아직 고려하지 않음
            held_stocks[stock_code] = (
                current_quantity + quantity, closing_price)  # {stock_code: (quantity, closing_price)}

            transaction_balance = closing_price * quantity  # 거래 대금
            total_purchase_amount += transaction_balance

            # 총 평가 금액 누적 (종가 기준)
            evaluation_amount, stock_info_id = select_stock_products(held_stocks, stock_code)
            total_evaluation_amount += evaluation_amount

        # 매도 시
        else:
            stock_code = random.choice(list(held_stocks.keys()))  # 보유 주식 중 랜덤으로 선택
            current_quantity, closing_price = held_stocks[stock_code]
            quantity = random.randint(1, current_quantity)  # 거래 수량
            sell_quantity = min(quantity, current_quantity)  # 보유 수량 이하로만 매도
            transaction_balance = closing_price * sell_quantity  # 거래 대금
            total_purchase_amount -= transaction_balance

            # 총 평가 금액 누적 (종가 기준)
            evaluation_amount, stock_info_id = select_stock_products(held_stocks, stock_code)
            total_evaluation_amount += evaluation_amount

            # 매도 후 주식 수량이 0이면 held_stocks에서 제거
            remaining_quantity = current_quantity - sell_quantity
            if remaining_quantity > 0:
                held_stocks[stock_code] = (remaining_quantity, closing_price)
            else:
                del held_stocks[stock_code]  # 주식 수량이 0이면 제거

        # 거래 기록 추가
        data_list.append((
            transaction_type,
            transaction_balance,
            quantity,
            target_date.strftime('%Y%m%d'),
            generate_trading_time(),  # 한국증권거래소 거래 가능 시간
            stock_account_id + 1,
            stock_info_id
        ))

    # 거래 기록 삽입
    query = """
    INSERT INTO stock_transaction (
        transaction_type,
        transaction_balance,
        transaction_quantity,
        transaction_date,
        transaction_time,
        stock_account_id,
        stock_info_id
    ) VALUES (%s, %s, %s, %s, %s, %s, %s)
    """
    cursor.executemany(query, data_list)

    db.commit()

    return total_evaluation_amount, total_purchase_amount


def insert_goal(user_id, current_asset):
    """목표를 생성하는 함수"""
    target_asset = random.randint(current_asset, current_asset + 100000000)
    # 자산 목표
    query = """
    INSERT INTO goal (
        goal_type,
        balance,
        start_balance,
        created_at,
        updated_at,
        user_id
    ) VALUES (%s, %s, %s, %s, %s, %s)
    """
    data = (
        '1',
        target_asset,
        current_asset,
        datetime.now().date().strftime("%Y%m%d"),
        datetime.now().date().strftime("%Y%m%d"),
        user_id
    )
    cursor.execute(query, data)
    db.commit()

    # 지출 목표
    query = """
    INSERT INTO goal (
        goal_type,
        balance,
        created_at,
        updated_at,
        user_id
    ) VALUES (%s, %s, %s, %s, %s)
    """
    data = (
        '2',
        99999999,
        datetime.now().date().strftime("%Y%m%d"),
        datetime.now().date().strftime("%Y%m%d"),
        user_id
    )
    cursor.execute(query, data)
    db.commit()


def insert_asset(user_id):
    """시간대 별 자산 총액을 생성하는 함수"""
    current_asset = 0  # 총 자산
    data_list = []
    query = """
    INSERT INTO asset (
        total_asset,
        account_balance,
        deposit_savings_balance,
        stock_balance,
        others_balance,
        updated_date,
        user_id
    ) VALUES (%s, %s, %s, %s, %s, %s, %s)
    """
    # 6개월 간 자산액 가져오기(지금은 랜덤한 값을 가져오나 추후에 월 단위로 지출, 자산 거래를 생성해서 수정이 가능할 듯 함)
    for i in range(6):
        account_total = random.randint(10000, 1000000000)
        deposit_total = random.randint(10000, 1000000000)
        saving_total = random.randint(10000, 1000000000)
        stock_total = random.randint(10000, 1000000000)
        etc_total = random.randint(10000, 1000000000)
        asset_total = account_total + deposit_total + saving_total + stock_total + etc_total
        if current_asset == 0:
            current_asset = asset_total
        data_list.append(
            (asset_total,
             account_total,
             deposit_total + saving_total,
             stock_total,
             etc_total,
             (datetime.now().date() - relativedelta(months=+i)).strftime('%Y%m%d'),
             user_id)
        )
    cursor.executemany(query, data_list)
    db.commit()
    return current_asset


def insert_expense(user_id):
    """지출 내역을 추가하는 함수"""
    data_list = []
    for _ in range(random.randint(1, 1000)):
        data_list.append((
            fake.company(),
            random.choice(spending_categories),
            fake.catch_phrase(),
            fake.date().replace('-', ''),
            fake.time().replace(':', ''),
            round(random.randint(1000, 5000000), -2),
            user_id
        ))

    query = """
    INSERT INTO expense (
        expense_name,
        expense_category,
        expense_memo,
        expense_date,
        expense_time,
        expense_balance,
        user_id
    ) VALUES (%s, %s, %s, %s, %s, %s, %s)
    """

    cursor.executemany(query, data_list)
    db.commit()
    return


def insert_alarm(user_id):
    """알람 데이터를 생성하고 추가하는 함수"""

    query = f"""
    INSERT INTO alarm (
        alarm_date,
        alarm_time,
        alarm_type,
        alarm_title,
        alarm_content,
        alarm_label,
        alarm_status,
        user_id
    ) VALUES (%s, %s, %s, %s, %s, %s, %s, {user_id})
    """
    # 지금은 알람을 모델 학습 외에는 방도가 없어서 기존 더미데이터를 모든 유저에 추가
    # data = (
    #     datetime.now().date().strftime("%Y%m%d"),
    #     datetime.now().time().strftime('%H%M%S'),
    #     random.choice(alarm_types),
    #     fake.sentence(),
    #     fake.paragraph(),
    #     random.choice(alarm_statuses),
    #     user_id
    # )
    cursor.executemany(query, alarms)
    db.commit()
    return


def insert_pet_list():
    """전체 펫 데이터를 추가하는 함수"""
    query = """
    INSERT INTO pet_list (
        pet_id,
        pet_code,
        pet_name,
        image_url
    ) VALUES (%s, %s, %s, %s)
    """
    cursor.executemany(query, pet_list)
    db.commit()
    return


def insert_collection(n, user_id):
    """유저가 보유한 펫 목록을 추가하는 함수"""
    select_pets()  # 펫 정보 조회
    selected_pet_ids = []  # 보유했던 펫의 id

    for i in range(n):
        pet_id = random.choice(inserted_ids["pet"])
        selected_pet_ids.append(pet_id)

        # 오래된 날짜부터 최신 날짜 순으로 생성일 설정
        created_date = datetime.now() - relativedelta(weeks=(n - i - 1))

        query = """
        INSERT INTO pet_collection (
            created_date,
            pet_id,
            user_id
        ) VALUES (%s, %s, %s)
        """
        data = (
            created_date.strftime("%Y%m%d"),  # YYYYMMDD 형식
            pet_id,
            user_id
        )
        cursor.execute(query, data)

    db.commit()
    return selected_pet_ids


def select_pets():
    """펫 정보 전체를 가져오는 함수"""
    query = "SELECT pet_id FROM pet_list"
    cursor.execute(query)

    # 모든 펫 ID를 리스트에 저장
    result = cursor.fetchall()
    inserted_ids["pet"] = [row[0] for row in result]  # pet_id만 저장
    return


def insert_pet_info(user_id, selected_pet_ids):
    """획득 펫의 상세 정보를 추가하는 함수"""
    data_list = []
    for pet_id in selected_pet_ids:
        # 펫 능력치(원래는 지출 데이터와 연동해야 함)
        finance_stat = random.randint(0, 100)
        food_bakery_stat = random.randint(0, 100)
        life_culture = random.randint(0, 100)
        shopping_stat = random.randint(0, 100)
        transportation_stat = random.randint(0, 100)
        total_stat = finance_stat + food_bakery_stat + life_culture + shopping_stat + transportation_stat

        data_list.append((
            total_stat,
            finance_stat,
            food_bakery_stat,
            life_culture,
            shopping_stat,
            transportation_stat,
            random.randint(1, 1000),
            random.randint(1, 1000),
            datetime.now().date().strftime("%Y%m%d"),
            pet_id,
            random.randint(1, 5),
            user_id
        ))

    query = """
    INSERT INTO pet_info (
        total_stat,
        finance_stat,
        food_bakery_stat,
        life_culture_stat,
        shopping_stat,
        transportation_stat,
        win_count,
        lose_count,
        created_date,
        pet_id,
        type_id,
        user_id
    ) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
    """
    cursor.executemany(query, data_list)
    db.commit()
    return


def insert_pet_type():
    """펫 타입을 추가하는 함수"""
    query = """
    INSERT INTO pet_type (
    type_code,
    type_name
    ) VALUES (%s, %s)
    """
    cursor.executemany(query, pet_type_list)
    db.commit()
    print('펫 타입 정보를 성공적으로 생성했습니다.')
    return
