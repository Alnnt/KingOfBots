package com.kob.backend.utils;

import java.util.HashMap;
import java.util.Map;

public class BackUtil {
    public static Map<String, Object> success(Map<String, Object> data) {
        Map<String, Object> map = new HashMap<>();
        map.put("code", 200);
        map.put("suessage", "success");
        map.put("data", data);
        return map;
    }
}
