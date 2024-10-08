import random
from faker import Faker

fake = Faker()

# stock_transaction 테이블 더미 데이터 생성
def generate_stock_transaction_data(num_records):
    stock_transaction_data = []
    
    for stock_transaction_id in range(1, num_records + 1):
        stock_name = fake.company()  # 랜덤한 주식 이름
        stock_code = fake.bothify(text='???')  # 랜덤한 주식 코드 (3자리)
        evaluation_amount = round(random.uniform(10.00, 1000.00), 2)  # 평가 금액
        purchase_amount = round(random.uniform(1.00, evaluation_amount), 2)  # 매입 금액은 평가 금액 이하
        
        # 거래 유형 (1: 매수, 2: 매도)
        transaction_type = random.choice([1, 2])  
        transaction_balance = round(random.uniform(10.00, 10000.00), 2)  # 거래 잔액
        transaction_quantity = random.randint(1, 100)  # 거래 수량
        transaction_date = fake.date(pattern='%Y%m%d', end_datetime=None)  # 거래 날짜 (YYYYMMDD 형식)
        transaction_time = fake.time(pattern='%H%M%S', end_datetime=None)  # 거래 시간 (HHMMSS 형식)
        
        stock_account_id = random.randint(1, 5)  # 랜덤한 주식 계좌 ID
        stock_id = random.randint(1, 10)  # 랜덤한 주식 정보 ID
        stock_info_id = random.randint(1, 100)  # 랜덤한 주식 정보 ID
        
        stock_transaction_data.append(f"({stock_transaction_id}, '{stock_name}', '{stock_code}', {evaluation_amount}, {purchase_amount}, {transaction_type}, {transaction_balance}, {transaction_quantity}, '{transaction_date}', '{transaction_time}', {stock_account_id}, {stock_id}, {stock_info_id})")

    query = (
        f"INSERT INTO `stock_transaction` "
        f"(`stock_transaction_id`, `stock_name`, `stock_code`, `evaluation_amount`, `purchase_amount`, `transaction_type`, `transaction_balance`, `transaction_quantity`, `transaction_date`, `transaction_time`, `stock_account_id`, `stock_id`, `stock_info_id`) "
        f"VALUES {', '.join(stock_transaction_data)};"
    )
    
    return query

# 메인 함수
def main():
    num_records = 100  # 생성할 레코드 수

    stock_transaction_query = generate_stock_transaction_data(num_records)
    print(stock_transaction_query)

if __name__ == "__main__":
    main()
