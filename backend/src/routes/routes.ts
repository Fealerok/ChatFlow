import express, {type Request, type Response} from "express"

const router = express();

router.get("/hello2", (req: Request, res: Response) => {
    res.send("Hello");
});

export default router;