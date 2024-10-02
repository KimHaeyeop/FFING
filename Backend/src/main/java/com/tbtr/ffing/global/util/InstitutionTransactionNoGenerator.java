package com.tbtr.ffing.global.util;

import java.util.Random;

public class InstitutionTransactionNoGenerator {

	/**
	 * 핀테크 서비스별 거래 고유번호 생성에 이용
	 * 새로운 번호로 임의 채번(YYYYMMDD + HHMMSS + 일련번호 6자리) 또는 20자리의 난수
	 * API 요청 시 사용자가 항상 새로운 번호로 임의 채번해야 함
	 *
	 * @return 6자리의 일련번호 생성
	 */
	public static String generateInstitutionTransactionUniqueNo() {
		Random random = new Random();
		int serialNumber = random.nextInt(1000000);
		return String.format("%06d", serialNumber);
	}

}
