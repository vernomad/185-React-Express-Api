import { useState, useTransition } from "react";
import { useRoutes } from "react-router-dom";
import { SubmitHandler, useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

// const userSchema = z.object({
//     username: z.string(),
//     password: z.string(),
// });

const validationSchema = z.object({
    username: z.string().min(3, { message: 'Name is required' }),
    password: z.string().min(4, { message: 'Password is required' }),
});

type ValidationSchema = z.infer<typeof validationSchema>;

export default function Login() {
  const [formError, setFormError] = useState("")
  const [message, setMessage] = useState("")
  const [isPending, startTransition] = useTransition();
  const [isFetching, setIsFetching] = useState(false);
  const isMutating = isFetching || isPending;

  const baseUrl = process.env.VITE_BASE_URL || 'https://185.valab.cloud';  

  console.log("Login Form:", baseUrl);


  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
} = useForm<ValidationSchema>({
    resolver: zodResolver(validationSchema),
    defaultValues: {
        username: '',
        password: '',
    },
});

const onSubmit: SubmitHandler<ValidationSchema> = async (data) => {

      try {
        setIsFetching(true);
        setFormError("")
        setMessage("")
        const res = await fetch(`${baseUrl}/api/auth/login`, {
            method: "POST",
            headers: {
              'content-type': 'application/json',
          },
           credentials: 'include',
            body: JSON.stringify(data)
    
          }) 
          if (!res.ok) {
           const message = await res.json()
           setFormError(message.message)
          } else {
           const loginMessage = await res.json()
           setMessage(loginMessage.message)
           console.log("Login Form:", import.meta.env.VITE_BASE_URL);
          startTransition(() => {
            reset()
           window.location.href = '/admin'; 
          })
          setIsFetching(false);
          }
      } catch (error) {
        console.log(error)
       // setFormError(error)
      }

    }

  const routes = useRoutes([
    
    {
      path: "",
      element: (
       
        <div className="container">           
          <h1>Login</h1>
          
          <form id="form-login" onSubmit={handleSubmit(onSubmit)}>
          {formError && ( 
                <span className="errors">{formError}</span>
            )}
          {message && (
                <span>{message}</span>
            )}
          <div className="form-control">
                    <input type="text"  placeholder="Your username" autoComplete='off' className={`input input-bordered w-full ${errors.username ? 'input-error' : ''
                        }`}  {...register("username")} />
                    {errors.username && <span>{errors.username?.message}</span>}
                    </div>
                    <div className="form-control">
                    <input type="password" placeholder="Secret word" autoComplete='off' className={`input input-bordered w-full ${errors.password ? 'input-error' : ''
                        }`} {...register('password')} />
                    {errors.password && <span>{errors.password?.message}</span>}
                    </div>
          
            <button 
            type="submit" 
            className="btn-submit" 
            disabled={isPending}
            style={{ opacity: !isMutating ? 1 : 0.7 }}>
              Send
            </button>
          </form>
        </div>
      ),
    },
  ]);

  return routes;
}
