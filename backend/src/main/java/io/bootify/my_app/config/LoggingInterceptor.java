package io.bootify.my_app.config;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.HandlerInterceptor;
import org.springframework.web.util.ContentCachingRequestWrapper;
import org.springframework.web.util.ContentCachingResponseWrapper;

import java.nio.charset.StandardCharsets;
import java.util.Collection;
import java.util.Enumeration;

@Component
public class LoggingInterceptor implements HandlerInterceptor {
    private static final Logger logger = LoggerFactory.getLogger(LoggingInterceptor.class);

    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) throws Exception {
        if (!(request instanceof ContentCachingRequestWrapper)) {
            return true;
        }

        ContentCachingRequestWrapper wrapper = (ContentCachingRequestWrapper) request;
        logRequest(wrapper);
        return true;
    }

    @Override
    public void afterCompletion(HttpServletRequest request, HttpServletResponse response, Object handler, Exception ex) throws Exception {
        logResponse(response);
    }

    private void logRequest(ContentCachingRequestWrapper request) {
        try {
            logger.info("\n========================= REQUEST START =========================");
            StringBuilder message = new StringBuilder();
            message.append("\nREQUEST DETAILS:\n")
                  .append("URI: ").append(request.getRequestURI()).append("\n")
                  .append("Method: ").append(request.getMethod()).append("\n")
                  .append("Headers:\n");

            Enumeration<String> headerNames = request.getHeaderNames();
            while (headerNames.hasMoreElements()) {
                String headerName = headerNames.nextElement();
                String headerValue = request.getHeader(headerName);
                message.append("\t").append(headerName).append(": ").append(headerValue).append("\n");
            }

            // Log request body
            byte[] content = request.getContentAsByteArray();
            if (content.length > 0) {
                String contentType = request.getContentType();
                String body = new String(content, StandardCharsets.UTF_8);
                message.append("Content-Type: ").append(contentType).append("\n");
                message.append("Body: ");
                if (contentType != null && contentType.contains("application/json")) {
                    message.append("\n\t").append(body.replace("\n", "\n\t"));
                } else {
                    message.append(body);
                }
                message.append("\n");
            } else {
                message.append("Body: <empty>\n");
            }

            logger.info(message.toString());
            logger.info("========================= REQUEST END ===========================\n");
        } catch (Exception e) {
            logger.error("Error logging request", e);
        }
    }

    private void logResponse(HttpServletResponse response) {
        try {
            logger.info("\n========================= RESPONSE START =========================");
            StringBuilder message = new StringBuilder();
            message.append("\nRESPONSE DETAILS:\n")
                  .append("Status: ").append(response.getStatus()).append("\n")
                  .append("Headers:\n");

            Collection<String> headerNames = response.getHeaderNames();
            for (String headerName : headerNames) {
                String headerValue = response.getHeader(headerName);
                message.append("\t").append(headerName).append(": ").append(headerValue).append("\n");
            }

            if (response instanceof ContentCachingResponseWrapper wrapper) {
                byte[] buf = wrapper.getContentAsByteArray();
                if (buf.length > 0) {
                    String payload = new String(buf, StandardCharsets.UTF_8);
                    message.append("Body: ").append(payload).append("\n");
                }
            }

            logger.info(message.toString());
            logger.info("========================= RESPONSE END ===========================\n");
        } catch (Exception e) {
            logger.error("Error logging response", e);
        }
    }
}