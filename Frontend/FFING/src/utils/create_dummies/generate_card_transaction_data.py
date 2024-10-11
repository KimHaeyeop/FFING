import random
from faker import Faker
import datetime

fake = Faker()

# card_transaction 테이블 더미 데이터 생성
def generate_card_transaction_data(num_records):
    card_transaction_data = []
    for _ in range(num_records):
        amount = round(random.uniform(50.00, 3000.00), 2)
        approved_at = fake.date_this_year()
        memo = fake.sentence(nb_words=6)
        is_deleted = random.choice([0, 1])
        category_id = random.randint(1, 10)
        card_id = random.randint(1, num_records)
        
        card_transaction_data.append(f"({amount}, '{approved_at}', '{memo}', {is_deleted}, {category_id}, {card_id})")
    
    query = f"INSERT INTO `card_transaction` (`amount`, `approved_at`, `memo`, `is_deleted`, `category_id`, `card_id`) VALUES {', '.join(card_transaction_data)};"
    return query

# 메인 함수
def main():
    num_records = 100  # 생성할 레코드 수

    user_query = generate_card_transaction_data(num_records)
    print(user_query)
    

if __name__ == "__main__":
    main()