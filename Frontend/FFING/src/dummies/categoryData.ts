export interface Merchant {
  merchantId: string;
  merchantName: string;
}

export interface Category {
  categoryId: string;
  categoryName: string;
  merchants: Merchant[];
}

export const categories: Category[] = [
  {
    categoryId: "CG-3fa85f6425e811e",
    categoryName: "주유",
    merchants: [
      { merchantId: "1545", merchantName: "현대오일뱅크" },
      { merchantId: "1546", merchantName: "SK엔크린" },
      { merchantId: "1547", merchantName: "GS칼텍스" },
    ],
  },
  {
    categoryId: "CG-4fa85f6425ad1d3",
    categoryName: "대형마트",
    merchants: [
      { merchantId: "1548", merchantName: "이마트 은평점" },
      { merchantId: "1549", merchantName: "롯데마트 강변점" },
      { merchantId: "1550", merchantName: "코스트코" },
    ],
  },
  {
    categoryId: "CG-4fa85f6455cad4a",
    categoryName: "교통",
    merchants: [
      { merchantId: "1551", merchantName: "카카오택시" },
      { merchantId: "1552", merchantName: "코레일" },
      { merchantId: "1553", merchantName: "한국철도공사" },
    ],
  },
  {
    categoryId: "CG-6dd85f6425ez11o",
    categoryName: "교육/육아",
    merchants: [
      { merchantId: "1554", merchantName: "타요키즈카페 대전둔산점" },
      { merchantId: "1555", merchantName: "메가스터디교육(주)" },
      { merchantId: "1556", merchantName: "가온누리 어린이집" },
    ],
  },
  {
    categoryId: "CG-7fa85f6425bc311",
    categoryName: "통신",
    merchants: [
      { merchantId: "1557", merchantName: "SK텔레콤" },
      { merchantId: "1558", merchantName: "(주)KT" },
      { merchantId: "1559", merchantName: "엘지유플러스" },
    ],
  },
  {
    categoryId: "CG-8fa85f6425e1123",
    categoryName: "해외",
    merchants: [
      { merchantId: "1560", merchantName: "알리익스프레스" },
      { merchantId: "1561", merchantName: "아마존 코리아" },
      { merchantId: "1562", merchantName: "Temu" },
    ],
  },
  {
    categoryId: "CG-9ca85f66311a23d",
    categoryName: "생활",
    merchants: [
      { merchantId: "1563", merchantName: "스타벅스 서울역점" },
      { merchantId: "1564", merchantName: "버거킹 신촌점" },
      { merchantId: "1565", merchantName: "24시 아이스크림 할인점" },
      { merchantId: "1954", merchantName: "스타벅스" },
      { merchantId: "1955", merchantName: "서브웨이" },
      { merchantId: "1956", merchantName: "넷플릭스" },
      { merchantId: "1957", merchantName: "올리브영" },
      { merchantId: "1958", merchantName: "무신사" },
    ],
  },
];
