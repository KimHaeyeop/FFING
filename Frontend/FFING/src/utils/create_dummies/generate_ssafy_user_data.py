import random
from faker import Faker
import datetime

fake = Faker()

# ssafy_user 테이블 더미 데이터 생성
def generate_ssafy_user_data(num_records):
    ssafy_user_data = []
    for _ in range(num_records):
        user_id = fake.email()
        username = user_id.split('@')[0]
        user_key = fake.uuid4()
        created_at = fake.date_this_year()

        ssafy_user_data.append(f"('{user_id}', '{username}', '{user_key}', '{created_at}')")
    
    query = f"INSERT INTO `ssafy_user` (`user_id`, `username`, `user_key`, `created_at`) VALUES {', '.join(ssafy_user_data)};"
    return query

# 메인 함수
def main():
    num_records = 1  # 생성할 레코드 수

    user_query = generate_ssafy_user_data(num_records)
    print(user_query)
    

if __name__ == "__main__":
    main()