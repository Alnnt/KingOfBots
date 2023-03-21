package com.kob.backend.controller.pk;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.LinkedList;
import java.util.List;

@RestController
public class BotInfoController {
    @RequestMapping("getbotinfo/")
    public List<String> getBotInfo(){
        List<String> list = new LinkedList<>();
        list.add("qwq");
        list.add("123");
        list.add("嘤嘤嘤");
        return list;
    }
}
