import random
from faker import Faker

fake = Faker()

# stock_info 테이블 더미 데이터 생성
def generate_stock_info_data(num_records):
    stock_info_data = []
    stock_codes = [fake.random_int(min=100, max=999) for _ in range(num_records)]  # 100-999 사이의 랜덤한 주식 코드 생성
    
    for stock_info_id in range(1, num_records + 1):
        stock_code = str(stock_codes[stock_info_id - 1])  # 주식 코드
        stock_name = fake.company()  # 랜덤한 주식 이름
        current_evaluation_price = round(random.uniform(50.00, 1500.00), 2)  # 현재 평가 금액

        stock_info_data.append(
            f"({stock_info_id}, '{stock_code}', '{stock_name}', {current_evaluation_price})"
        )

    query = (
        f"INSERT INTO `stock_info` "
        f"(`stock_info_id`, `stock_code`, `stock_name`, `current_evaluation_price`) "
        f"VALUES {', '.join(stock_info_data)};"
    )
    
    return query

# 메인 함수
def main():
    num_records = 100  # 생성할 레코드 수

    stock_info_query = generate_stock_info_data(num_records)
    print(stock_info_query)

if __name__ == "__main__":
    main()
