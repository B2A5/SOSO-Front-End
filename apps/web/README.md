This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

spring:
datasource:
url: jdbc:mysql://34.64.60.157:3306/soso-mysql?serverTimezone=Asia/Seoul&characterEncoding=UTF-8
username: root
password: soso
driver-class-name: com.mysql.cj.jdbc.Driver

jpa:
hibernate:
ddl-auto: update
properties:
hibernate:
format_sql: true
use_sql_comments: true
dialect: org.hibernate.dialect.MySQL8Dialect
open-in-view: false

sql:
init:
encoding: UTF-8

session:
store-type: redis
redis:
namespace: shboard:session

data:
redis:
host: localhost
port: 6379

kafka:
bootstrap-servers: localhost:29092
consumer:
group-id: soso-group
auto-offset-reset: earliest
key-deserializer: org.apache.kafka.common.serialization.StringDeserializer
value-deserializer: org.springframework.kafka.support.serializer.JsonDeserializer
properties:
spring.json.trusted.packages: "com.example.soso.vote.dto"

      producer:
        key-serializer: org.apache.kafka.common.serialization.StringSerializer
        value-serializer: org.springframework.kafka.support.serializer.JsonSerializer

cloud:
gcp:
credentials:
location: file:///C:/Users/ktnu2/Downloads/intense-dolphin-465010-f3-f4b7fccf3d55.json
project-id: intense-dolphin-465010
storage:
bucket: soso-bucket-01
base-url: https://storage.googleapis.com/soso-bucket-01

kafka:
topics:
vote-events: vote-events
vote-counts: vote-counts
popular-votes: popular-votes
trending-votes: trending-votes
vote-summary: vote-summary

server:
servlet:
session:
cookie:
name: JSESSIONID
timeout: 30m

oauth:
kakao:
client-id: 80b3d24a8187a50d03658b082d700cce
redirect-uri: http://localhost:3000/auth

jwt:
secret-key: my-secret-12345678901234567890123456789012
access-token-validity-in-ms: 180000000
refresh-token-validity-in-ms: 1209600000

frontend:
origin: http://localhost:3000,https://soso-front-end-web.vercel.app
