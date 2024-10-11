import { create } from 'zustand';

interface FinanceFirmInfo {
  background: string;
  logoUrl: string;
}

interface FinanceFirmCodeStore {
  financeFirmMetaData: { [key: string]: FinanceFirmInfo };
  setFinanceFirmMetaData: (data: { [key: string]: FinanceFirmInfo }) => void;
}

const useFinanceFirmCodeStore = create<FinanceFirmCodeStore>((set) => ({
  financeFirmMetaData: {
    '001': {
      'background': 'linear-gradient(100deg, #6C64AA 0%, #B6ADF4 100%)', // 한국은행
      'logoUrl': '/logo/finance_firm/001.svg',
    },
    '002': {
      'background': 'linear-gradient(100deg, #DD29C3 0%, #FBB18E 100%)', // 산업은행
      'logoUrl': '/logo/finance_firm/002.svg',
    },
    '003': {
      'background': 'linear-gradient(100deg, #50AB55 0%, #90E13D 100%)', // 기업은행
      'logoUrl': '/logo/finance_firm/003.svg',
    },
    '004': {
      'background': 'linear-gradient(100deg, #FFD700 0%, #FFA500 100%)', // 국민은행
      'logoUrl': '/logo/finance_firm/004.svg',
    },
    '011': {
      'background': 'linear-gradient(100deg, #008000 0%, #ADFF2F 100%)', // 농협은행
      'logoUrl': '/logo/finance_firm/011.svg',
    },
    '020': {
      'background': 'linear-gradient(100deg, #0000FF 0%, #87CEEB 100%)', // 우리은행
      'logoUrl': '/logo/finance_firm/020.svg',
    },
    '023': {
      'background': 'linear-gradient(100deg, #FF4500 0%, #FF6347 100%)', // SC제일은행
      'logoUrl': '/logo/finance_firm/023.svg',
    },
    '027': {
      'background': 'linear-gradient(100deg, #1E90FF 0%, #00BFFF 100%)', // 시티은행
      'logoUrl': '/logo/finance_firm/027.svg',
    },
    '032': {
      'background': 'linear-gradient(100deg, #FF8C00 0%, #FFA07A 100%)', // 대구은행
      'logoUrl': '/logo/finance_firm/032.svg',
    },
    '034': {
      'background': 'linear-gradient(100deg, #4682B4 0%, #B0C4DE 100%)', // 광주은행
      'logoUrl': '/logo/finance_firm/034.svg',
    },
    '035': {
      'background': 'linear-gradient(100deg, #32CD32 0%, #98FB98 100%)', // 제주은행
      'logoUrl': '/logo/finance_firm/035.svg',
    },
    '037': {
      'background': 'linear-gradient(100deg, #8B0000 0%, #FA8072 100%)', // 전북은행
      'logoUrl': '/logo/finance_firm/037.svg',
    },
    '039': {
      'background': 'linear-gradient(100deg, #000080 0%, #4169E1 100%)', // 경남은행
      'logoUrl': '/logo/finance_firm/039.svg',
    },
    '045': {
      'background': 'linear-gradient(100deg, #FFD700 0%, #FFEC8B 100%)', // 새마을금고
      'logoUrl': '/logo/finance_firm/045.svg',
    },
    '081': {
      'background': 'linear-gradient(100deg, #008080 0%, #20B2AA 100%)', // KEB하나은행
      'logoUrl': '/logo/finance_firm/081.svg',
    },
    '088': {
      'background': 'linear-gradient(100deg, #FF0000 0%, #FF6347 100%)', // 신한은행
      'logoUrl': '/logo/finance_firm/088.svg',
    },
    '090': {
      'background': 'linear-gradient(100deg, #FF4500 0%, #FF8C00 100%)', // 카카오뱅크
      'logoUrl': '/logo/finance_firm/090.svg',
    },
    '999': {
      'background': 'linear-gradient(100deg, #4B0082 0%, #8A2BE2 100%)', // 싸피은행
      'logoUrl': '/logo/finance_firm/999.svg',
    },
  },
  setFinanceFirmMetaData: (data) => set({ financeFirmMetaData: data }),
}));

export default useFinanceFirmCodeStore;
