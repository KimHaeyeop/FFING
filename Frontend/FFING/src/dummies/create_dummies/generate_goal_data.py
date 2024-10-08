import random
from faker import Faker
import datetime

fake = Faker()

# goal 테이블 더미 데이터 생성
def generate_goal_data(num_records):
    goal_data = []
    for n in range(1, num_records + 1):
        goal_type = n
        balance = round(random.uniform(1000.00, 10000.00), 2)
        created_at = fake.date_this_year().strftime("%Y%m%d")  # YYYYMMDD 형식
        updated_at = created_at
        user_id = 1
        
        goal_data.append(f"({goal_type}, {balance}, '{created_at}', '{updated_at}', {user_id})")
    
    query = f"INSERT INTO `goal` (`goal_type`, `balance`, `created_at`, `updated_at`, `user_id`) VALUES {', '.join(goal_data)};"
    return query

# 메인 함수
def main():
    num_records = 2  # 생성할 레코드 수

    user_query = generate_goal_data(num_records)
    print(user_query)
    

if __name__ == "__main__":
    main()