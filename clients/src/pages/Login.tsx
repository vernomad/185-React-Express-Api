import { useState, useTransition } from "react";
import { useRoutes } from "react-router-dom";
import { SubmitHandler, useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useUser } from "../useUser";
import { AppActionType } from "../types/AppActionTypes";
import { baseUrl } from "../lib/baseUrl";
import { usePageView } from "../hooks/usePageView";

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

  const { dispatch } = useUser()
  usePageView('/login')

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
console.log("Data-login:", data)
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
          const response = await res.json()
          console.log("REspnse:" , response)
          if (!res.ok) {
     
           setFormError(response.message)
          } else {
           setMessage(response.message)

          localStorage.setItem("user", JSON.stringify(response.user))
          dispatch({ type: AppActionType.SET_USER, payload:  response.user})
            const { displayIp } = response; 
          if (response.user.id === "hack") {
             startTransition(() => {
            reset()
           window.location.href = `/unauthorized-hack?ip=${displayIp}`; 
          })
          return
          }

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
          <div className="wrapper-login">         
          <h1 className="hidden">Admin login</h1>
          
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
            className="btn-submit-login" 
            disabled={isPending}
            style={{ opacity: !isMutating ? 1 : 0.7 }}>
              Admin-login
            </button>
          </form>
        </div>
        </div>  
      ),
    },
  ]);

  return routes;
}
