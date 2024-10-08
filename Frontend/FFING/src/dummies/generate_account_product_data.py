import random
from faker import Faker
import datetime

fake = Faker()

# account_product 테이블 더미 데이터 생성
def generate_account_product_data(num_records):
    account_product_data = []
    for _ in range(num_records):
        account_type_unique_no = fake.uuid4()
        account_name = fake.word()
        bank_code = fake.random_number(digits=3, fix_len=True)
        bank_name = fake.company()

        account_product_data.append(f"('{account_type_unique_no}', '{account_name}', '{bank_code}', '{bank_name}')")
    
    query = f"INSERT INTO `account_product` (`account_type_unique_no`, `account_name`, `bank_code`, `bank_name`) VALUES {', '.join(account_product_data)};"
    return query

# 메인 함수
def main():
    num_records = 10  # 생성할 레코드 수

    user_query = generate_account_product_data(num_records)
    print(user_query)
    

if __name__ == "__main__":
    main()