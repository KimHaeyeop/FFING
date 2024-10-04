import random
from faker import Faker
import datetime

fake = Faker()

# user 테이블 더미 데이터 생성
def generate_user_data(num_records):
    user_data = []
    roles = ['USER', 'ADMIN']
    genders = ['M', 'F']
    for _ in range(num_records):
        email = fake.email()
        password = fake.password(length=10)
        username = fake.user_name()
        role = random.choice(roles)
        gender = random.choice(genders)
        birth = fake.date_of_birth(minimum_age=18, maximum_age=70)
        nickname = fake.unique.first_name()
        pin = random.randint(1000, 9999)
        created_at = fake.date_this_year()
        updated_at = created_at
        ssafy_user_id = 1
        
        user_data.append(f"('{email}', '{password}', '{username}', '{role}', '{gender}', '{birth}', '{nickname}', {pin}, '{created_at}', '{updated_at}', {ssafy_user_id})")
    
    query = f"INSERT INTO `user` (`email`, `password`, `username`, `role`, `gender`, `birth`, `nickname`, `pin`, `created_at`, `updated_at`, `ssafy_user_id`) VALUES {', '.join(user_data)};"
    return query

# 메인 함수
def main():
    num_records = 1  # 생성할 레코드 수

    user_query = generate_user_data(num_records)
    print(user_query)
    

if __name__ == "__main__":
    main()