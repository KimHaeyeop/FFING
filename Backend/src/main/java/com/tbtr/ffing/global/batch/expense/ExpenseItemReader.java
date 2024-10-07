package com.tbtr.ffing.global.batch.expense;

import com.tbtr.ffing.domain.user.entity.User;
import com.tbtr.ffing.domain.user.repository.UserRepository;
import org.springframework.batch.item.ItemReader;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.util.Iterator;

@Component
public class ExpenseItemReader implements ItemReader<User> {
    @Autowired
    private UserRepository userRepository;
    private Iterator<User> userIterator;

    @Override
    public User read() {
        if (userIterator == null) {
            userIterator = userRepository.findAll().iterator();
        }

        if (userIterator.hasNext()) {
            return userIterator.next();
        } else {
            userIterator = null; // Reset for next job execution
            return null;
        }
    }
}