# TCP Multiplayer Server

## 👋 소개

- ‘net’ 모듈을 사용한 TCP 서버 구현
- 2D 멀티플레이어 게임서버 구현

## 👩‍💻 개발자

<table>
  <tbody>
    <tr>
      <td align="center"><a href="https://github.com/KR-EGOIST"><img src="https://avatars.githubusercontent.com/u/54177070?v=4" width="100px;" alt=""/><br /><sub><b> 개발자 : 윤진호 </b></sub></a><br /></td>
      </tr>
  </tbody>
</table>

## ⚙️ Backend 기술 스택

<img src="https://img.shields.io/badge/node.js-339933?style=for-the-badge&logo=Node.js&logoColor=white">
<img src="https://img.shields.io/badge/mysql-4479A1?style=for-the-badge&logo=mysql&logoColor=white">

```
npm install dotenv lodash long mysql2 protobufjs uuid
npm install -D nodemon prettier
```

## 📄 패킷 구조

### [패킷 구조](https://industrious-lasagna-717.notion.site/Node-js-5f01dba6de4646ac8f31d6d95d55cb6c?pvs=4)

## 📃 ERD Diagram

![Untitled](https://github.com/KR-EGOIST/tcp-multiplayer-server/assets/54177070/7130d297-d2dd-4977-a91d-20d75ccb71dc)

## ⚽ 프로젝트 주요 기능

#### 1. **게임을 실행하면 Device ID, IP, PORT 의 기본정보를 입력받습니다.**
  - deviceId는 클라이언트 → 서버로 전달하는 값입니다.
    - device id 를 빈값으로 접속하는 경우, 클라이언트에서 uuid를 생성합니다.
    - device id 를 따로 입력받을 수도 있습니다.

  - InitialPayload 의 playerId 는 캐릭터의 종류입니다. 이 역시 클라이언트에서 결정해서 서버로 전송하게 됩니다.
    - latency는 최초에 1번만 클라이언트가 서버에게 보내고 있습니다.
   
```
[ProtoContract]
public class InitialPayload
{
    [ProtoMember(1, IsRequired = true)]
    public string deviceId { get; set; }

    [ProtoMember(2, IsRequired = true)]
    public uint playerId { get; set; }
    
    [ProtoMember(3, IsRequired = true)]
    public float latency { get; set; }
}
```

#### 2. **클라이언트 주도로 위치 패킷을 교환하게 됩니다.**
  - 이때 클라이언트가 서버에게 보내는 패킷의 Payload 는 LocationUpdatePayload 을 사용하게 되며 서버로 부터 받는 정보는 LocationUpdate 의 형태로 받게됩니다.
    - 클라이언트 주도: 클라이언트의 초당 프레임 수(fps)에 맞춰 현재 서버의 유저들에 대한 위치 동기화 패킷을 요청
    - 클라이언트가 요청하면 → 서버에서 위치 패킷 전송

#### 3. **비지니스 로직**
  - **게임 인스턴스 생성**
    - 게임 인스턴스가 서버가 기동될 때 동시에 생성
    - 언제나 1개의 게임 인스턴스가 활성화 상태
   
  - **유저 접속**
    - 유저 접속시 1번에서 생성해 둔 게임 인스턴스에 등록
    - 유저는 { x, y } 의 정보를 세팅해둔 프레임(1/30)별로 서버로 전송
   
  - **유저 위치 업데이트**
    - 위치 업데이트 핸들러에서 유저 위치를 업데이트
    - 위치 업데이트가 끝났으면 모든 유저의 위치 정보를 직렬화해서 클라이언트에게 Send
   
#### 4. **DB 연동**
  - 같은 device id 를 가진 유저가 재접속 했을 경우 마지막 위치에서 재접속
  - DB(MySQL)을 연동하여 유저 게임 종료 시 유저의 마지막 위치를 저장
    - 유저의 device id 를 사용하여 유저 정보를 저장
   
#### 5. **Latency 를 이용한 추측항법 적용** (진행중)
