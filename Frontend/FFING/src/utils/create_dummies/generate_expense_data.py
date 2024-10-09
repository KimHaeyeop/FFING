import random
from faker import Faker
import datetime
from time import strftime
import re
fake = Faker()

categories = ['FOOD_BAKERY', 'TRANSPORTATION', 'SHOPPING', 'LIFE_CULTURE', 'FINANCE', 'OVERSEAS']

# expense 테이블 더미 데이터 생성
def generate_expense_data(num_records):
    expense_data = []
    for _ in range(num_records):
        amount = round(random.uniform(100.00, 5000.00), 2)
        content = fake.sentence(nb_words=4)
        memo = fake.sentence(nb_words=6)
        spending_date = fake.date_this_year().strftime("%Y%m%d")  # YYYYMMDD 형식
        spending_time = re.sub('[:]', '', fake.time())
        category_id = random.choice(categories)
        account_id = 1

        expense_data.append(f"({amount}, '{content}', '{memo}', '{spending_date}', '{spending_time}', '{category_id}', {account_id})")
    
    query = f"INSERT INTO `expense` (`expense_balance`, `expense_name`, `expense_memo`, `expense_date`, `expense_time`, `expense_category`, `user_id`) VALUES {', '.join(expense_data)};"
    return query

# 메인 함수
def main():
    num_records = 1000  # 생성할 레코드 수

    user_query = generate_expense_data(num_records)
    print(user_query)
    

if __name__ == "__main__":
    main()
