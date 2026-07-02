"""AI 推論 API（プレースホルダ）。

web(nginx) が /model/ 以下をこのサービスにそのまま渡すため、ルートも /model 配下に置く。
Swagger UI は /model/docs、ヘルスチェックは /model/health。
"""

from fastapi import APIRouter, FastAPI

app = FastAPI(
    title="mobility-infra model API",
    docs_url="/model/docs",
    openapi_url="/model/openapi.json",
)

router = APIRouter(prefix="/model")


@router.get("/health")
def health():
    return {"status": "ok"}


@router.post("/predict")
def predict(payload: dict):
    # TODO: 不動産データを用いた推論を実装
    return {"input": payload, "prediction": None}


app.include_router(router)
