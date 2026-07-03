# NestJS 学習ログ 2026-07-04

## モジュール構成
- **すべて Module で管理される**。最低でもルートの `AppModule` があり、機能ごとに `UsersModule` などへ分割する。
- モジュールは `@Module({ controllers, providers, imports, exports })` で束ねる（DI 登録の単位）。
- **単一責務**が基本。1ファイル1役割：
  - `*.controller.ts` … HTTP / ルーティング
  - `*.service.ts` … ビジネスロジック
  - `*.module.ts` … 配線（DI 登録）
- ディレクトリは機能単位。**単複はフォルダ名・クラス名・ルートで統一**する（CLI 慣習は複数形）。
  ```
  users/
    users.controller.ts
    users.service.ts
    users.module.ts
  ```

## アーキテクチャ（どこから来ているか）
- NestJS が直接まねているのは **Angular**（デコレータ・モジュール・DI）。
- 「クラス＋DI コンテナ」という感覚は Java の **Spring** に近い。
  → 「Java のように」ではなく **「Angular 由来、DI は Spring 的」** が正確。
- **DI（依存性注入）**：`constructor` に書くだけで Nest が実体を注入する。`new` しない。
  ```ts
  constructor(private readonly usersService: UsersService) {}
  ```

## ルーティングの優先順位
- **「静的か動的か」ではなく “宣言順（先に書いた方）” が優先**。この差はフレームワーク依存。
- **Express（このプロジェクトの構成）＝宣言順が勝つ。** 静的を動的より先に書く。

```ts
@Controller('users')            // 単複は統一（複数形が慣習）
export class UsersController {
  constructor(private readonly usersService: UsersService) {}  // DI

  @Get('all')                   // GET /users/all（静的・先に書く）
  findAll() {
    return this.usersService.findAll();
  }

  @Get(':id')                   // GET /users/:id（動的・後）
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(+id);
  }
}
```

- もし `@Get(':id')` を先に書くと、`GET /users/all` は `:id`（`id="all"`）に食われて `all` ハンドラに到達しない。
- 参考：`@nestjs/platform-fastify` は内部の find-my-way ルータが**静的を自動優先**するので順不同（本プロジェクトは Express なので順番が全て）。
- 補足：デコレータの書式は `@Get(':id')`（括弧・クォートに注意）。

## ハマった点
- **`GET http://localhost:8080/` が 404**：`main.ts` の `app.setGlobalPrefix('api')` により全ルートが `/api` 配下になるため。ルートは `/api/users`・`/api/health` で叩く。`/` にルートは無い。
- レスポンスの `id` 重複に注意（`{id:1}` が2件…など、モックデータのコピペミス）。


Queryについて

import { Controller, Get, Query } from '@nestjs/common';

@Controller('user')
export class UserController {
    // Get /user
    @Get()
    getUsers(@Query('name') name: string) {
        return [
            { id: 1, name: name || 'John Doe' },
            { id: 1, name: 'Adrian' },
        ];
    }
}

Queryとデコレーターを追加することによってnameのが検索できるようになる。
ただ実際にはフィルターをいれること
名前パラメータに基づいて配列フィルタリングします。
import { Controller, Get, Query } from '@nestjs/common';

@Controller('user')
export class UserController {
    // Get /user
    @Get()
    getUsers(@Query('name') name: string) {
        const users = [
            { id: 1, name: 'John Doe' },
            { id: 1, name: 'Adrian' },
        ];

        if (name) {
            return users.filter((user) =>
                user.name.toLowerCase().includes(name.toLowerCase
                    ()),
            );
        }
        return users;
    }
}

これによって配列を変数に格納しif文によってフィルタリングが可能になる。

http://localhost:8080/api/user?name=Something

では空の配列が返却される

またIDを読み込む@Paramデコレーターも存在する

    @Get(':id')
    getUserById(@Param('id') id: string) {
        return { id, name: 'John Doe' };
    }
なので理論的にデータベースでそのユーザーを検索して返すことができる。

### なぜ id が 123 になるのか
`id` の値は **URL のパスから動的に取り出される**（ハードコードでも DB でもない）。

`GET /api/user/123` を叩くと：
1. `:id` がパスの `123` の部分にマッチ
2. `@Param('id')` がそこを取り出し、引数 `id` に `"123"` を注入
3. `{ id }` は `{ id: id }` の省略記法なので `{ "id": "123", "name": "John Doe" }` が返る

→ `/api/user/999` なら `999`、`/api/user/abc` なら `abc`。URL の値がそのまま入るだけ。

### 重要：`@Param` は必ず string
`id` は数値に見えても文字列 `"123"`（JSON でも `"id":"123"`）。DB 検索や数値比較に使うなら変換が要る。

```ts
// 手動変換
@Get(':id')
getUserById(@Param('id') id: string) {
  const userId = Number(id);   // "123" → 123
  return { id: userId, name: 'John Doe' };
}
```

NestJS 流には **`ParseIntPipe`**（数値でなければ自動で 400）：

```ts
@Get(':id')
getUserById(@Param('id', ParseIntPipe) id: number) {  // id は number 型
  return { id, name: 'John Doe' };
}
```
- `GET /api/user/123` → `id = 123`（number）
- `GET /api/user/abc` → **400 Bad Request**（自動バリデーション）

→ 実務では **ParseIntPipe で数値化＋バリデーション**してから `service.findOne(id)` に渡す。

@Bodyデコレーターについて
クライアントがデータをボディ内に送信する場合、POSTとPUT用のボディデコレータも存在する。

    @Post()
    createUser(@Body() body: any) {
        return { message: 'User created successfully'};
    }

HTTPフォームやPostManのようなAPIテストツール通してデータを渡すと、本文を読み取ることができる。

また現状any型で型安全性が失われるが、そこで使用するのがDTO(Data Transfer Objects)

DTOとは、受信データの正確な構造を定義するTypescriptクラスです。
ここではInterfaceではなくクラスを使用する
なぜInterfaceを使用しないかというとコンパイル時に消去されるため

対してクラスは存続するためNestはそれを検証パイプと組み合わせて実行時にデータを検証することができる。
Class → ValidationPipe

これについてはパイプの説明のときに行う。

では必要なDTOを作成する。
対象のuserのディレクトリの配下にDTOのディレクトリを作成し、
そこにdtoのファイルを作成する。そこからエクスポートして、単一クラスを作成できる。

また更新の場合、入力項目は通常オプション。

DTOは複製の代わりに部分型と呼ばれるものを提供してくれる。
そこでupdate-user.dto.tsという別のファイルを作成する。

### @Body / @Post / @Put の添削

書いたコード（POST 作成・PUT 更新）を添削すると：

```ts
import { Body, Param, Post, Put } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Post() // POST /user
createUser(@Body() createUserDto: CreateUserDto) {   // 変数名は camelCase
  return { data: createUserDto, message: 'User created successfully' };
}

@Put(':id') // PUT /user/:id  ← ルートに :id が必須
updateUser(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
  return {
    data: { id, ...updateUserDto },
    message: 'User updated successfully',
  };
}
```

**添削ポイント**
1. **`@Put()` → `@Put(':id')`（重要バグ）**：コメントは `/user/:id` なのにデコレータに `:id` が無いと、`@Param('id')` は `undefined` になる。**ルート側に `:id` を宣言して初めて** Param が取れる。
2. **引数名 `CreateUserDto` → `createUserDto`（camelCase）**：パラメータ名をクラス名と同じ PascalCase にすると、関数内でクラス名を変数が隠す（shadowing）。動くが紛らわしい。慣習は camelCase。
3. **型注釈だけでは検証されない**：`@Body() dto: CreateUserDto` は**コンパイル時の型**が付くだけ。実行時に中身を検証するには `ValidationPipe`（グローバル or ハンドラ単位）＋ DTO に `class-validator` デコレータ（`@IsString()` 等）が必要。今は `data` に**送った JSON がそのまま**返るだけ（＝まだ無検証）。→ メモ通りパイプの章で対応。
4. **PUT と PATCH**：`UpdateUserDto` は `PartialType`（全項目 optional＝部分更新）なので、意味的には **PATCH** が適切（PUT は全置換）。実務では部分更新は PATCH を使うことが多い。PUT でも動くが役割の違いは意識する。

---

> 以上が **コントローラー編**（ルーティング / `@Param` / `@Query` / `@Body` / DTO）。

---

# Providers 編（次に書く）

※ メモ用スケルトン。ここを埋めていく。

## Provider とは
- `@Injectable()` を付けたクラス。多くは **Service**。DI コンテナが生成し、コンストラクタ経由で注入する。
- 役割分担：**Controller は薄く（HTTP の入出力だけ）／ビジネスロジックは Service（Provider）へ**寄せる。

## 登録と注入
- モジュールの `providers` 配列に登録：
  ```ts
  @Module({ controllers: [UsersController], providers: [UsersService] })
  export class UsersModule {}
  ```
- 使う側はコンストラクタで受け取るだけ（`new` しない ＝ DI）：
  ```ts
  constructor(private readonly usersService: UsersService) {}
  ```

## Controller のロジックを Service へ移す例
```ts
@Injectable()
export class UsersService {
  private users = [{ id: 1, name: 'John Doe' }];

  findAll() {
    return this.users;
  }
  findOne(id: number) {
    return this.users.find((u) => u.id === id);
  }
}
```
→ Controller は `return this.usersService.findAll()` のように**呼ぶだけ**になる。



## 追って埋めるトピック
- **スコープ**：既定は **Singleton**（アプリ全体で1インスタンス）。ほかに `REQUEST` / `TRANSIENT`。
- **他モジュールで共有**：提供側で `exports`、利用側で `imports`。
- **カスタムプロバイダ**：`useClass` / `useValue` / `useFactory` / `useExisting` とトークン注入 `@Inject('TOKEN')`。
