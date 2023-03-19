from website import create_app
import flask_cors

app = create_app()
flask_cors.CORS(app)

if __name__ == '__main__':
    app.run(debug=True)
