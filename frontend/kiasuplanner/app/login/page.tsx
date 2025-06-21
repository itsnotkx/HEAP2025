

import {Input} from "@heroui/react";

export default function App() {
  return (
    <>
    <h1 className="">Login</h1>
    <div className="flex w-full flex-wrap md:flex-nowrap gap-4">
      <Input label="Username" placeholder="Enter your username" type="username" />
    </div>
    </>
  );
}
