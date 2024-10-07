import random
from faker import Faker
import datetime

fake = Faker()

# account 테이블 더미 데이터 생성
def generate_account_data(num_records):
    account_data = []
    for _ in range(num_records):
        account_num = fake.unique.random_number(digits=12, fix_len=True)
        balance = round(random.uniform(1000.00, 50000.00), 2)
        is_primary = random.choice([0, 1])
        account_product_id = random.randint(1, num_records)
        user_id = random.randint(1, num_records)

        account_data.append(f"('{account_num}', {balance}, {is_primary}, {account_product_id}, {user_id})")

    query = f"INSERT INTO `account` (`account_num`, `balance`, `is_primary`, `account_product_id`, `user_id`) VALUES {', '.join(account_data)};"
    return query

# 메인 함수
def main():
    num_records = 10  # 생성할 레코드 수

    user_query = generate_account_data(num_records)
    print(user_query)
    

if __name__ == "__main__":
    main()