package com.runtime.jobs;

import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.stereotype.Service;

@Service
@ConditionalOnProperty(name = "redis.enabled", havingValue = "true")
public class JobProducer
{

    private final StringRedisTemplate redisTemplate;
    private static final String QUEUE_NAME = "Runtime";

    public JobProducer(StringRedisTemplate redisTemplate)
    {
        this.redisTemplate = redisTemplate;
    }

    public void submitJob(String jobData)
    {
        redisTemplate.opsForList().leftPush(QUEUE_NAME, jobData);
        System.out.println("Job pushed to queue: " + jobData);
    }
}
