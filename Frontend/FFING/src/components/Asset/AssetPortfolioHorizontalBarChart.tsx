import React from 'react';
import { Bar } from 'react-chartjs-2';
import { useNavigate } from 'react-router-dom'
import Icon from '@mdi/react';
import { mdiChevronRight } from '@mdi/js'

interface currentAssets {
  accountBalance: number;
  assetId: number;
  depositSavingsBalance: number;
  othersBalance: number;
  stockBalance: number;
  totalAsset: number;
  updatedDate: string;
}

interface AssetPortfolioHorizontalBarChartProps {
  currentAsset: currentAssets | undefined;
}

const AssetPortfolioHorizontalBarChart: React.FC<AssetPortfolioHorizontalBarChartProps> = ({ currentAsset }) => {
  const navigate = useNavigate()

  if (!currentAsset) {
    return <p>자산 정보가 없습니다.</p>;
  }

  const handleBalance = (title: string) => {
    navigate('product', { state: { title }});
  }

  const legends = [
    {
      title: '예금/적금',
      balance: currentAsset.depositSavingsBalance,
      percentage: (currentAsset.depositSavingsBalance / currentAsset.totalAsset) * 100,
      color: '#7C00FE'
    },
    {
      title: '입출금 통장',
      balance: currentAsset.accountBalance,
      percentage: (currentAsset.accountBalance / currentAsset.totalAsset) * 100,
      color: '#F9E400'
    },
    {
      title: '주식',
      balance: currentAsset.stockBalance,
      percentage: (currentAsset.stockBalance / currentAsset.totalAsset) * 100,
      color: '#FFAF00'
    },
    {
      title: '기타 자산',
      balance: currentAsset.othersBalance,
      percentage: (currentAsset.othersBalance / currentAsset.totalAsset) * 100,
      color: '#F5004F'
    },
  ]

  const data = {
    labels: ['자산 구성'],
    datasets: legends.map((legend) => ({
      label: legend.title,
      data: [legend.percentage],
      backgroundColor: legend.color,
    })),
  };

  const options = {
    indexAxis: 'y', // 수평 바 차트
    responsive: false,
    plugins: {
      legend: {
        display: false,
      },
    },
    title: {
      display: false, // 차트 제목 숨기기
    },
    scales: {
      x: {
        stacked: true,
        grid: {
          display: false, // x축 배경 grid 삭제
        },
        ticks: {
          display: false, // x축 인덱스 삭제
        },
        border: {
          display: false,
        },
      },
      y: {
        stacked: true,
        grid: {
          display: false, // y축 배경 grid 삭제
        },
        ticks: {
          display: false, // y축 인덱스 삭제
        },
        border: {
          display: false,
        },
      },
    },
  };

  return (
    <div className="h-full w-full flex flex-col">
      <div className='flex justify-center'>
        <Bar data={data} options={options} />
      </div>
        {legends.map((legend, i) => {
          return (
            <div key={i} className='flex justify-between text-lg text-left my-2'>
              <div className='flex items-center'>
                {/* 색상 */}
                <div className='h-8 w-8 rounded-full mx-4 text-left' style={{backgroundColor: legend.color}} />
                {/* 금융 상품과 비율 */}
                <div>
                  <p>{legend.title}</p>
                  <p className='text-sm'>{legend.percentage}%</p>
                </div>
              </div>
              {/* 금액 */}
              <div>
                <p className='flex' onClick={() => handleBalance(legend.title)}>
                  <span className='font-galmuri-11-bold'>{(legend.balance / 10000).toLocaleString()}만 원</span>
                  <Icon path={mdiChevronRight} size={1} />
                </p>
              </div>
            </div>
          )
        })}
    </div>
  );
};

export default AssetPortfolioHorizontalBarChart;
