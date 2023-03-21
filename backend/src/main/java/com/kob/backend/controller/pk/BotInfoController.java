package com.kob.backend.controller.pk;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;
import java.util.HashMap;

@RestController
@RequestMapping("/pk/")
public class BotInfoController {
    @RequestMapping("getbotinfo/")
    public Map<String, String> getBotInfo(){
        Map<String, String> obj = new HashMap<>();
        obj.put("name","Anrylnro");
        obj.put("rating","1500");
        return obj;
    }
}
