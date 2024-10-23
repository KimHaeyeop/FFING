import mysql.connector
import random
from tqdm import tqdm
import faker
from dateutil.relativedelta import relativedelta
from datetime import datetime
from ffing_dummy import create_query
import os
from dotenv import load_dotenv

fake = faker.Faker('ko-KR')
used_nicknames = set()  # 생성된 닉네임을 저장할 집합

load_dotenv(dotenv_path=os.path.join((os.getcwd()), '.env'))
# MySQL 연결 설정
db = mysql.connector.connect(
    host="localhost",
    user="root",
    password=os.getenv('MY_SQL_PASSWORD'),
    database="ffing_db"
)
cursor = db.cursor()

# 삽입된 ID를 추적하는 딕셔너리
inserted_ids = {
    "ssafy_user": [],
    "user": [],
    "account_product": [],
    "deposit_product": [],
    "saving_product": [],
    "card_product": [],
    "account": [],
    "deposit_account": [],
    "saving_account": [],
    "card": [],
    "stock_account": [],
    "stock_info": [],
    "pet": [],
    "pet_type": [],
}


def execute_query(query, data, table_name):
    """SQL 쿼리 실행 및 ID 저장."""
    try:
        cursor.execute(query, data)
        db.commit()
        inserted_ids[table_name].append(cursor.lastrowid)
    except mysql.connector.Error as err:
        print(f"Error inserting into {table_name}: {err}")


def insert_multiple_data(cursor, table_name, data):
    """생성한 데이터를 한 번에 추가하는 함수"""
    return


def generate_unique_nickname():
    """중복하지 않는 고유한 닉네임 생성 함수"""
    while True:
        nickname = fake.user_name()
        if nickname not in used_nicknames:
            used_nicknames.add(nickname)
            return nickname


if __name__ == '__main__':
    print('데이터 생성 시작!')
    print('=' * 100)

    # 펫 관련 기본 정보 추가
    create_query.insert_pet_type()
    create_query.insert_pet_list()

    # 금융 상품 추가(입출금, 예금, 적금, 카드, 주식)
    num_cards = num_accounts = 100  # 100건의 상품 데이터 추가
    create_query.insert_account_product(num_accounts)
    create_query.insert_deposit_product()
    create_query.insert_saving_product()
    create_query.insert_card_product(num_cards)
    create_query.insert_stock_info()

    # # n명의 사용자 데이터를 생성함
    for i in tqdm(range(1, 100), desc='유저 정보를 생성하는 중...', mininterval=0.01):
        # 가짜 데이터 생성
        username = fake.name()
        email = fake.ascii_free_email()
        uuid4 = fake.uuid4()
        birth = fake.date_of_birth()
        nickname = generate_unique_nickname()  # 중복되지 않는 닉네임 생성
        random_weeks = random.randint(1, 5)
        created_at = datetime.now() - relativedelta(weeks=random_weeks)  # 오늘부터 5주 전의 랜덤한 날짜

        # 유저 정보
        ssafy_user_id = create_query.insert_ssafy_user(username, email, uuid4, created_at)
        user_id = create_query.insert_user(username, email, birth, nickname, ssafy_user_id, created_at)

        # 입출금 계좌 생성
        create_query.insert_account(user_id, num_accounts)
        # 예금 계좌 생성
        create_query.insert_deposit_account_with_transactions(random.randint(1, 5), ssafy_user_id)
        # 적금 계좌 생성
        create_query.insert_saving_account_with_transactions(random.randint(1, 5), ssafy_user_id)
        # 증권 계좌 생성
        create_query.insert_stock_account(random.randint(1, 5), ssafy_user_id)
        # 카드 생성
        create_query.insert_card(ssafy_user_id, num_cards)

        # 총 자산 생성
        current_asset = create_query.insert_asset(user_id)
        # 총 지출 생성
        create_query.insert_expense(user_id)
        # 자산, 지출 목표 생성
        create_query.insert_goal(user_id, current_asset)

        # 획득한 펫 목록 생성
        selected_pet_ids = create_query.insert_collection(random_weeks, user_id)
        # 펫 능력치 설정
        create_query.insert_pet_info(user_id, selected_pet_ids)

        # 알람 생성
        create_query.insert_alarm(user_id)

    print('=' * 100)
    print("데이터 생성 완료! ಥ_ಥ")
