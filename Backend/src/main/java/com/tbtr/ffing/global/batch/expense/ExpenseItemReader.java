package com.tbtr.ffing.global.batch.expense;

import com.tbtr.ffing.domain.user.entity.User;
import com.tbtr.ffing.domain.user.repository.UserRepository;
import org.springframework.batch.item.ItemReader;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.util.List;

/**
 * Expense 생성을 위한 사용자 정보를 읽어오는 ItemReader
 */
@Component
public class ExpenseItemReader implements ItemReader<User> {

    @Autowired
    private UserRepository userRepository;

    private List<User> users;
    private int nextUserIndex;

    /**
     * 배치 처리를 위한 사용자 정보를 읽어옵니다.
     * 모든 사용자를 한 번에 조회하고, 순차적으로 반환합니다.
     *
     * @return 다음 사용자 또는 모든 사용자를 처리했다면 null
     * @throws Exception 사용자 정보 읽기 중 발생할 수 있는 예외
     */
    @Override
    public User read() throws Exception {
        if (users == null) {
            users = userRepository.findAll();
            nextUserIndex = 0;
        }

        User nextUser = null;

        if (nextUserIndex < users.size()) {
            nextUser = users.get(nextUserIndex);
            nextUserIndex++;
        }

        return nextUser;
    }
}