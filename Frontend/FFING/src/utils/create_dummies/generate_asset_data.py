import random
from faker import Faker
import datetime

fake = Faker()

# asset 테이블 더미 데이터 생성
def generate_asset_data(num_records):
    asset_data = []
    
    for _ in range(num_records):
        asset_id = _ + 1  # auto increment 기능을 모방하기 위해 순차적으로 증가
        total_asset = round(random.uniform(5000.00, 100000.00), 2)  # 총 자산
        account_balance = round(random.uniform(1000.00, 50000.00), 2)  # 계좌 잔액
        deposit_savings_balance = round(random.uniform(500.00, 10000.00), 2)  # 예금 잔액
        stock_balance = round(random.uniform(0.00, 20000.00), 2)  # 주식 잔액
        others_balance = round(random.uniform(0.00, 5000.00), 2)  # 기타 잔액
        # updated_date = datetime.datetime.now().strftime("%Y%m%d")  # 업데이트 날짜 YYYYMMDD 형식
        userId = 1
        
        asset_data.append(f"({asset_id}, {total_asset}, {account_balance}, {deposit_savings_balance}, {stock_balance}, {others_balance}, {userId})")

    query = f"INSERT INTO `asset` (`asset_id`, `total_asset`, `account_balance`, `deposit_savings_balance`, `stock_balance`, `others_balance`, `user_id`) VALUES {', '.join(asset_data)};"
    
    return query

# 메인 함수
def main():
    num_records = 1  # 생성할 레코드 수

    asset_query = generate_asset_data(num_records)
    print(asset_query)

if __name__ == "__main__":
    main()
