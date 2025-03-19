package io.bootify.my_app.config;

import jakarta.servlet.http.HttpServletRequest;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.core.Ordered;
import org.springframework.core.annotation.Order;
import org.springframework.http.server.ServletServerHttpRequest;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;
import org.springframework.web.filter.CommonsRequestLoggingFilter;

@Component
@Order(Ordered.HIGHEST_PRECEDENCE)
public class RequestResponseLoggingFilter extends CommonsRequestLoggingFilter {
    private static final Logger logger = LoggerFactory.getLogger(RequestResponseLoggingFilter.class);
    
    public RequestResponseLoggingFilter() {
        super();
        setIncludeQueryString(true);
        setIncludePayload(true);
        setMaxPayloadLength(10000);
        setIncludeHeaders(true);
        setBeforeMessagePrefix("REQUEST DATA : ");
        setAfterMessagePrefix("REQUEST PROCESSED : ");
    }

    @Override
    protected boolean shouldLog(HttpServletRequest request) {
        return request.getRequestURI().startsWith("/api");
    }

    @Override
    protected void beforeRequest(HttpServletRequest request, String message) {
        if (shouldLog(request)) {
            logger.debug("{}", message);
        }
    }

    @Override
    protected void afterRequest(HttpServletRequest request, String message) {
        if (shouldLog(request)) {
            logger.debug("{}", message);
        }
    }

    @Override
    protected String createMessage(HttpServletRequest request, String prefix, String suffix) {
        StringBuilder msg = new StringBuilder();
        msg.append(prefix);
        msg.append(request.getMethod()).append(" ");
        msg.append(request.getRequestURI());

        if (isIncludeQueryString()) {
            String queryString = request.getQueryString();
            if (queryString != null) {
                msg.append('?').append(queryString);
            }
        }

        if (isIncludeHeaders()) {
            msg.append(", headers=").append(new ServletServerHttpRequest(request).getHeaders());
        }

        if (isIncludePayload()) {
            String payload = getMessagePayload(request);
            if (StringUtils.hasText(payload)) {
                msg.append(", payload=").append(payload);
            }
        }

        msg.append(suffix);
        return msg.toString();
    }
}