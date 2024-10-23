# data ffing_db 더미 데이터 생성 코드 사용 방법

### API 발급 방법
1. [금융상품한눈에API - 금융감독원](https://finlife.fss.or.kr/finlife/main/contents.do?menuNo=700030)에서 API 발급받기
2. `.env`에 `FINLIFE_API_KEY='발급받은 API'`추가하기

### `anaconda`이 설치되어 있다면
1. 터미널을 열고 `conda create --name '가상환경이름' python=3.12`
2. `S11P21A504\Frontend\FFING\src\utils` 경로로 이동
3. `pip install -r requirements.txt`를 입력하여 라이브러리 설치
4. `ffing_db` 초기화(notion database 탭에서 확인)
5. `python create_dummy.py`을 터미널에 입력하거나 `create_dummy.py` 실행

### `anaconda`가 설치되어 있지 않다면
1. 터미널을 열고 `S11P21A504\Frontend\FFING\src\utils` 경로로 이동
2. vsc 확장 프로그램에서 python 설치(pycharm이라면 화면 우하단에서 가상 환경 수동으로 생성해도 됨)
3. `python -m venv venv`로 가상환경 설치
4. `cd venv/Script`를 입력하여 이동
5. `activate`로 가상 환경 실행
6. `pip install -r requirements.txt`로 라이브러리 설치
7. `ffing_db` 초기화(notion database 탭에서 확인)
8. `python create_dummy.py`을 터미널에 입력하거나 `create_dummy.py` 실행
9. 가상 환경 종료는 `deactivate`


**springboot와 연동할 수 있다고 하는데 그건 알아서 한 번 해 보세요.**

### issue
가끔 `select_stock_products`의 수행 결과로 반환하는 stock_id가 `None`인 경우가 있습니다.
