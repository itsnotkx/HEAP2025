import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function Login() {
  return (
    <form className="flex flex-col gap-6 max-w-sm mx-auto mt-20">
      <div className="flex flex-col items-center gap-2 text-center">
        <h1 className="text-2xl font-bold">Login to KiasuPlanner</h1>
        <p className="text-balance text-sm text-muted-foreground">
          Enter your username and password below to login to your account
        </p>
      </div>
      <div className="grid gap-6">
        <div className="grid gap-2">
          <Label htmlFor="username">Username</Label>
          <Input
            required
            id="username"
            name="username"
            placeholder="johndoe"
            type="text"
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="password">Password</Label>
          <Input required id="password" name="password" type="password" />
        </div>
        <Button className="w-full" type="submit">
          Login
        </Button>
      </div>
    </form>
  );
}
