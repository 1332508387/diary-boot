package redis;

import com.lh.diary.Application;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.test.context.junit4.SpringRunner;

@RunWith(SpringRunner.class)
@SpringBootTest(classes = Application.class)
public class TestRedis {
    @Autowired
    private StringRedisTemplate stringRedisTemplate;

    @Autowired
    private RedisTemplate<String, String> redisTemplate;

    @Test
    public void testSet() {
        this.redisTemplate.opsForValue().set("key_str", "test_date");
    }

    @Test
    public void testGet() {
        Object result = this.redisTemplate.opsForValue().get("key_str");
        System.out.println(result);
    }

}
