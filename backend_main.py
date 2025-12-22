from fastapi import FastAPI
import uvicorn
from core.frontend_api import setup_frontend_api


def create_app() -> FastAPI:
    app = FastAPI(title="Flynt Studio Backend")
    # Mount the frontend API routes
    setup_frontend_api(app)
    return app


app = create_app()


if __name__ == "__main__":
    uvicorn.run("backend_main:app", host="0.0.0.0", port=8000, reload=True)
