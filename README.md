# FFING

마이데이터를 기반으로 자산 및 지출을 관리하고, 지출 데이터를 활용한 게임 서비스를 제공하는 플랫폼입니다.

<br>

## 목차

1. [기획배경](#1-기획배경)
2. [소식](#2-소식)
3. [주요기능](#3-주요기능)
   - [회원가입/로그인](#회원가입로그인)
   - [자녀관리](#자녀관리)
   - [목표설정 및 리워드](#목표설정-및-리워드)
   - [추억적금](#추억적금)
   - [펀딩](#펀딩)
4. [개발환경](#4-개발환경)
5. [팀원소개](#5-팀원소개)
6. [느낀점](#6-느낀점)

<br>

## 1. 기획배경

'거지방'은 젊은이의 유행에서 '무지출·무소비'라는 하나의 문화가 되었습니다.

<br>

이는 지출을 줄이는 목표를 달성하기 위한 하나의 수단으로 서로의 소비를 공유함으로써 동기 부여를 받는 것을 목표로 합니다. 하지만, 현재 실정은 사진을 통한 인증이라는 단순한 수준에 그치고 있습니다.

<br>

이는 전반적인 소비 습관을 개선하기보다 인증을 위해 소비를 하지 않는 주(主)와 객(客)이 바뀔 수 있다는 생각이 들었습니다. <br>

즉, 이 에너지를 단순히 **지출하지 않았다는 사실을 공유하는 것에 사용하는 것보다** 자신의 전반적인 소비 습관을 건강하게 할 수 있는 데 치환할 수 있는 방법의 필요함을 느꼈습니다.

<br>

이에 마이데이터를 통해 연동한 지출액과 형성 자산 목표액을 능력치로 삼아 전투를 진행하는 게임 형태로 풀어냈습니다. 자신의 소비 패턴을 기반으로 한 새로운 능력치를 펫을 획득하여 도감을 채우고, 전투를 통해 랭킹을 올리는 방식으로 지출 관리에 흥미를 느끼게 했습니다.

<br>

이를 통해 사용자는 대전을 통해 다른 유저와의 비교를 통해 자신의 소비 행태를 파악하고, 아기자기한 펫이 주는 알림을 통해 소비 개선을 위한 도구로 활용할 수 있을 것입니다.

<br>

## 2. 소식

- 2024.10.11: We released the FFING 1.0.0.0 version. Check out the 📑 Technical Report!

## 3. 주요기능

### 목표 설정

- 연간 자산 목표를 설정할 수 있습니다.
- 목표 자산을 달성할 수 있는 월 소비액을 추천합니다.
- 월간 소비 상한액을 정합니다.
- 설정한 목표를 기반으로 지출 관리 및 게임 데이터를 설정합니다.

<div style="display: flex; justify-content: space-between;">
    <img src="https://github.com/user-attachments/assets/1bfdeaed-ddcb-49ef-87ae-0ef3424edc7d" alt="Screenshot 1" width="48%">
</div>

### 자산 관리

- 연동한 마이데이터 중 자산 내역 카테고리 분류 및 분석

<div style="display: flex; justify-content: space-between;">
    <img src="https://github.com/user-attachments/assets/c36aaf33-dee3-481f-b0ae-2f5000655e00" alt="Screenshot 1" width="48%">
    <img src="https://github.com/user-attachments/assets/52757a39-41f1-485f-bbde-ff3aa03d59dd" alt="Screenshot 2" width="48%">
</div>

### 지출 관리

- 부모와 자녀의 공동 활동으로, 자녀가 달성할 특정 목표를 세우고 이를 달성할 시 부모에게 리워드를 받을 수 있습니다.
- 자녀가 요청한 경우 혹은 정해진 기간이 만료된 경우 부모에게 목표 달성 여부 확인을 요청할 수 있습니다.
- 목표 달성이 확인되면 부모는 연동된 계좌를 통해 자녀의 계좌로 간편하게 리워드를 송금할 수 있습니다.

<div style="display: flex; justify-content: space-between;">
    <img src="https://github.com/user-attachments/assets/d60fb481-2196-4093-9d75-33dee1dcb6d4" alt="Screenshot 1" width="48%">
</div>

### 알림

- 자산 현황 알림
- 이상 지출 탐지
- 펫 관리 알림

<div style="display: flex; justify-content: space-between;">
    <img src="https://github.com/user-attachments/assets/fab5aa23-dfe3-491f-b2be-1c1643e3e072" alt="Screenshot 1" width="48%">
</div>

### 게임

- 자기 자신 또는 타인을 위한 펀딩을 개설할 수 있습니다.
- 펀딩 개설자가 금액을 입력하면 펀딩이 시작됩니다.
- QR코드를 통해 편의점 등에서 간편하게 펀딩에 참여할 수 있습니다.
- 펀딩에 참여한 모든 이는 메시지를 남길 수 있습니다.

<div style="display: flex; justify-content: space-between;">
    <img src="https://github.com/user-attachments/assets/c36aaf33-dee3-481f-b0ae-2f5000655e00" alt="Screenshot 1" width="48%">
    <img src="https://github.com/user-attachments/assets/52757a39-41f1-485f-bbde-ff3aa03d59dd" alt="Screenshot 2" width="48%">
</div>
<br>

## 4. 개발환경

- Front-end: React 18.3.1, Firebase 9.5.0, Phaser 3.85.2, Typescript, Zustand, React-query, tailwind
- Back-end: JDK 21, SpringBoot 3.3.2, SpringSecurity 6.3.1, MySQL 8.3.0
- Infra: Nginx, AWS EC2, AWS S3, Prometheus, Grafana
- 버전 및 이슈관리: Gitlab, Gitlab Issues
- 협업 툴: Notion, MatterMost, Figma, Erdcloud, Jira, GoogleWorkspace

<br>

## 5. 팀원소개

| 이름                                     | 구분 | 역할   | 수행업무                     |
| ---------------------------------------- | ---- | ------ | ---------------------------- |
| [변재호](https://github.com/bjho606)     | 팀장 | BE, In | 로그인, 자녀관리, 추억적금   |
| [김명화](https://github.com/monghwadang) | 팀원 | BE, FE | 추억적금, 펀딩               |
| [김해엽](https://github.com/해엽김)      | 팀원 | BE,    | 홈, 마이페이지, 자녀관리     |
| [탁인혁](https://github.com/InhyukTak)   | 팀원 | BE, DB | 목표설정, 리워드             |
| [원민혁](https://github.com/wmy4534)     | 팀원 | FE     | 목표설정, 리워드, 펀딩       |
| [이규석](https://github.com/qldrh112)    | 팀원 | FE     | 게임, 도감, 자산, 지출, 알림 |

<br>

## 6. 느낀점

### 변재호

> 느낀점

### 김명화

> 느낀점

### 김해엽

> 느낀점

### 원민혁

> 느낀점

### 이규석

> 느낀점

- 팀에 리더십 부재가 미치는 영향을 깨달았다. 앞으로 상황에 맞게 카멜레온처럼 리더와 팔로워를 오갈 수 있는 사람으로 거듭나기를 원한다.
- 설계를 깊게 할 수 있는 방법을 연구할 필요를 느꼈다. 기획을 못 하면 서비스에 문제가 생기지만, 설계를 제대로 하지 않으면, 했던 것을 다시 해야 하는 불상사가 생긴다.
- 일정 관리는 어렵다. 내가 만든 기능을 언제 끝낼 지 알 수가 없다. 이를 개선하기 위해 jira, notion 등을 통해 관리해봤는데 따로 PM 포지션이 있는 이유를 알았다. 이 노하우를 조금 배울 수 있는 기회가 있었으면 좋겠다.
