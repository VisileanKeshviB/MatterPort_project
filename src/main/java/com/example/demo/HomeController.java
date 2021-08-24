package com.example.demo;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

@Controller
public class HomeController {
	
//	@RequestMapping("home")
//	@ResponseBody
	@GetMapping("/gotoindex")
	public String index1() {
		
		return "index.html";
	}
}
