import random
from faker import Faker
import datetime

fake = Faker()

# category 테이블 더미 데이터 생성
def generate_category_data(num_records):
    category_data = []
    for _ in range(num_records):
        category_name = fake.word()
        user_id = random.randint(1, num_records)

        category_data.append(f"('{category_name}', {user_id})")

    query = f"INSERT INTO `category` (`category_name`, `user_id`) VALUES {', '.join(category_data)};"
    return query

# 메인 함수
def main():
    num_records = 10  # 생성할 레코드 수

    user_query = generate_category_data(num_records)
    print(user_query)
    

if __name__ == "__main__":
    main()