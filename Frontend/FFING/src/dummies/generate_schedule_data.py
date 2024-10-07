import random
from faker import Faker
import datetime

fake = Faker()

# schedule 테이블 더미 데이터 생성
def generate_schedule_data(num_records):
    schedule_data = []
    for _ in range(num_records):
        title = fake.sentence(nb_words=3)
        start_date = fake.date_this_year()
        end_date = fake.future_date(end_date="+30d")
        memo = fake.sentence(nb_words=6)
        is_deleted = random.choice([0, 1])
        category_id = random.randint(1, num_records)
        user_id = random.randint(1, num_records)

        schedule_data.append(f"('{title}', '{start_date}', '{end_date}', '{memo}', {is_deleted}, {category_id}, {user_id})")

    query = f"INSERT INTO `schedule` (`title`, `start_date`, `end_date`, `memo`, `is_deleted`, `category_id`, `user_id`) VALUES {', '.join(schedule_data)};"
    return query

# 메인 함수
def main():
    num_records = 10  # 생성할 레코드 수

    user_query = generate_schedule_data(num_records)
    print(user_query)
    

if __name__ == "__main__":
    main()