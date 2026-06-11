FROM alpine:3.19

ARG PB_VERSION=0.23.4

RUN apk add --no-cache \
    unzip \
    ca-certificates \
    wget

RUN wget -q https://github.com/pocketbase/pocketbase/releases/download/v${PB_VERSION}/pocketbase_${PB_VERSION}_linux_amd64.zip \
    -O /tmp/pb.zip && \
    unzip /tmp/pb.zip -d /pb/ && \
    rm /tmp/pb.zip && \
    chmod +x /pb/pocketbase

# Copy auto-setup hook that creates collections on first boot
COPY pb_hooks/ /pb/pb_hooks/

VOLUME /pb/pb_data

EXPOSE 8090

CMD ["/pb/pocketbase", "serve", "--http=0.0.0.0:8090", "--dir=/pb/pb_data"]
