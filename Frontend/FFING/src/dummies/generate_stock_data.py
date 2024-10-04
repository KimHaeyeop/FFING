import random
from faker import Faker

fake = Faker()

# stock 테이블 더미 데이터 생성
def generate_stock_data(num_records):
    stock_data = []
    
    for stock_id in range(1, num_records + 1):
        securities_company_code = fake.random_int(min=100, max=999)  # 100-999 사이의 랜덤한 증권사 코드
        stock_account_created_at = fake.date_this_year().strftime("%Y%m%d")  # YYYYMMDD 형식
        stock_account_last_transaction_date = fake.date_this_year().strftime("%Y%m%d")  # YYYYMMDD 형식
        total_evaluation_amount = round(random.uniform(1000.00, 100000.00), 2)  # 총 평가 금액
        total_purchase_amount = round(random.uniform(1000.00, 100000.00), 2)  # 총 구매 금액
        ssafy_user_id = 1  # 항상 1로 설정
        
        stock_data.append(
            f"({stock_id}, '{securities_company_code}', '{stock_account_created_at}', "
            f"'{stock_account_last_transaction_date}', {total_evaluation_amount}, "
            f"{total_purchase_amount}, {ssafy_user_id})"
        )

    query = (
        f"INSERT INTO `stock` "
        f"(`stock_id`, `securities_company_code`, `stock_account_created_at`, "
        f"`stock_account_last_transaction_date`, `total_evaluation_amount`, "
        f"`total_purchase_amount`, `ssafy_user_id`) "
        f"VALUES {', '.join(stock_data)};"
    )
    
    return query

# 메인 함수
def main():
    num_records = 100  # 생성할 레코드 수

    stock_query = generate_stock_data(num_records)
    print(stock_query)

if __name__ == "__main__":
    main()
