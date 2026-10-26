import express, {type Request, type Response} from "express"

const router = express();

router.post("/auth", (req: Request, res: Response) => {
    console.log(req.body);
});

export default router;