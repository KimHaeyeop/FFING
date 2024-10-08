import random
from faker import Faker
import datetime

fake = Faker()

# card 테이블 더미 데이터 생성
def generate_card_data(num_records):
    card_data = []
    for _ in range(num_records):
        card_num = fake.unique.credit_card_number(card_type=None)
        card_limit = round(random.uniform(1000.00, 5000.00), 2)
        card_name = fake.word()
        card_company = fake.company()
        user_id = random.randint(1, num_records)

        card_data.append(f"('{card_num}', {card_limit}, '{card_name}', '{card_company}', {user_id})")

    query = f"INSERT INTO `card` (`card_num`, `card_limit`, `card_name`, `card_company`, `user_id`) VALUES {', '.join(card_data)};"
    return query

# 메인 함수
def main():
    num_records = 100  # 생성할 레코드 수

    user_query = generate_card_data(num_records)
    print(user_query)
    

if __name__ == "__main__":
    main()