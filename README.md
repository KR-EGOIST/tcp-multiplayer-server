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
    p커닝) 적용**
  - 클라이언트는 따로 위치를 계산해 플레이어의 캐릭터는 부드럽데 움직이도록 했습니다.
  - 서버는 플레이어 외 다른 유저의 위치를 계산해 플레이어 화면에 위치 이동이 보이도록 구현했습니다.
  - 계산 방식 : (속도 * 프레임) + (속도 * 프레임 * 레이턴시)

  - 결론적으로 레이턴시가 높을수록 상대방의 움직임이 끊겨보입니다.

#### 남아있는 버그
  - 플레이어가 자신 화면에서 상대방을 밀면 안밀리지만 상대방 화면에서는 밀리고 있는 문제
  - 실시간 유저의 fps를 받아서 실시간으로 추측항법(데드 레코닝)을 계산할려고 했지만 실시간으로 fps를 서버에서 전달받더니 클라이언트에서 다음에 접속한 유저의 정보가 저장되지 않는 버그가 있었습니다.
    - 그래서 게임 종료시 유저의 마지막 위치 x, y 좌표 값이 NaN 으로 값이 전달돼 DB에서 오류가 납니다.
