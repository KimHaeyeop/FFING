package com.tbtr.ffing.domain.game.service.impl;

import com.tbtr.ffing.domain.game.service.MatchingService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class MatchingServiceImpl implements MatchingService {

    private final RedisTemplate<String, String> redisTemplate;

//    @Transactional
//    public ChatRoom addUserOptions(long timeMillis, MatchReq req) {
//        ChatRoom room = setRoomInfo(req);
//        redisTemplate.opsForZSet().add(Integer.toString(req.getOptionCount())+":"+ req.getPrefer(),
//                req.getUuId() + ":" + req.getRoomKey(), timeMillis);
//
//        return room;
//    }
//
//    @Transactional
//    public ChatRoom modifyUserOptions(MatchReq req) {
//
//        ChatRoom room = chatRoomRepository.findByRoomKey(req.getRoomKey());
//
//        redisTemplate.opsForZSet().remove(Integer.toString(req.getOptionCount()+1)+":"+ req.getPrefer(), req.getUuId()+ ":" + req.getRoomKey());
//        redisTemplate.opsForZSet().add(Integer.toString(req.getOptionCount())+":"+ req.getPrefer(),
//                req.getUuId() + ":" + req.getRoomKey(), req.getTime());
//
//        return room;
//    }
//
//    // 매칭을 수행하는 메소드
//    @Transactional
//    public String preferMatching(MatchReq req) {
//        int positionIdx = req.getPrefer().indexOf("-");
//
//        // 매칭 시, prefer 중 포지션 부분은 서로 반대되는 것 끼리 매칭시켜줘야 함
//        // position은 둘 중 하나임.
//        String position = req.getPrefer().substring(positionIdx + 1).equals("101") ? "100" :
//                req.getPrefer().substring(positionIdx + 1).equals("111")?"111":"101";
//        String prefer = Integer.toString(req.getOptionCount())+":"+ req.getPrefer().substring(0, positionIdx) + "-" + position;
//        int preferCount = req.getPrefer().split(",").length;
//
//        Set<String> user = redisTemplate.opsForZSet().range(prefer, 0, 0);
//
//        // 매칭 prefer과 매칭되는 사용자가 있다면 방 입장 및 redis 대기열에서 삭제
//        if(user !=null && user.size()> 0){
//            String matchUser = user.iterator().next();
//            // ':'를 기준으로 분리하여 value 가져오기
//            String[] parts = matchUser.split(":");
//            String uuId = "";
//            String roomKey = "";
//            if (parts.length >= 2) {
//                uuId = parts[0];
//                roomKey = parts[1];
//            }
//            enterRoomInfo(req, uuId, roomKey);
//            redisTemplate.opsForZSet().remove(prefer, uuId + ":" + roomKey);
//
//            return roomKey;
//        }
//
//        else if(user.size()== 0){
//            // 옵션 전체 일치 아닐 시 옵션개수 기준으로 비교
//            ScanOptions scanOptions = ScanOptions.scanOptions().match(req.getOptionCount()+":*").build();
//            Cursor<byte[]> keys = redisTemplate.getConnectionFactory().getConnection().scan(scanOptions);
//
//            if (keys.hasNext()) {
//                return checkOptions2(keys, req);
//            }
//        }
//        return "";
//    }
}
