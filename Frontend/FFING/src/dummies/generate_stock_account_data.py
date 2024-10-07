import random
from faker import Faker
import datetime

fake = Faker()

# stock_account 테이블 더미 데이터 생성
def generate_stock_account_data(num_records):
    stock_account_data = []
    
    for stock_account_id in range(1, num_records + 1):
        securities_company_code = fake.bothify(text='???')  # 랜덤한 증권사 코드
        securities_company_name = fake.company()  # 랜덤한 증권사 이름
        stock_account_balance = round(random.uniform(1000.00, 50000.00), 2)  # 계좌 잔액
        total_evaluation_amount = round(random.uniform(0.00, 100000.00), 2)  # 총 평가 금액
        total_purchase_amount = round(random.uniform(0.00, total_evaluation_amount), 2)  # 총 매입 금액
        ssafy_user_id = 1  # 항상 1로 설정
        
        stock_account_data.append(f"({stock_account_id}, '{securities_company_code}', '{securities_company_name}', {stock_account_balance}, {total_evaluation_amount}, {total_purchase_amount}, {ssafy_user_id})")

    query = f"INSERT INTO `stock_account` (`stock_account_id`, `securities_company_code`, `securities_company_name`, `stock_account_balance`, `total_evaluation_amount`, `total_purchase_amount`, `ssafy_user_id`) VALUES {', '.join(stock_account_data)};"
    
    return query

# 메인 함수
def main():
    num_records = 10  # 생성할 레코드 수

    stock_account_query = generate_stock_account_data(num_records)
    print(stock_account_query)

if __name__ == "__main__":
    main()
