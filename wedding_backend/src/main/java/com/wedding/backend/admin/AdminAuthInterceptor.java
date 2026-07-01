package com.wedding.backend.admin;

import org.springframework.web.servlet.HandlerInterceptor;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;

/** /admin/login, /admin/logout을 제외한 모든 /admin/** 경로는 세션 인증을 요구한다. */
public class AdminAuthInterceptor implements HandlerInterceptor {

    public static final String SESSION_KEY = "ADMIN_AUTHENTICATED";

    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) throws Exception {
        HttpSession session = request.getSession(false);
        boolean authenticated = session != null && Boolean.TRUE.equals(session.getAttribute(SESSION_KEY));
        if (authenticated) {
            return true;
        }
        response.sendRedirect(request.getContextPath() + "/admin/login");
        return false;
    }
}
