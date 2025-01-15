import React, { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { TextField, Grid, Typography, Box, Button } from "@mui/material";
import { LoadingButton } from "@mui/lab";

const LoginSignup = () => {
    const [isLogin, setIsLogin] = useState(true); // Toggle between login and signup
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
  
    const loginFormik = useFormik({
      initialValues: {
        username: "",
        password: "",
      },
      validationSchema: Yup.object({
        username: Yup.string().required("Username is required"),
        password: Yup.string().required("Password is required"),
      }),
      onSubmit: async (values) => {
        setLoading(true);
        try {
          const response = await axios.post("http://localhost:8000/api/v1/login", values);
          setMessage(`Welcome ${values.username}! Redirecting to Home...`);
          localStorage.setItem("username", response.data.id);
          setTimeout(() => {
            navigate("/home");
          }, 2000);
        } catch (error) {
          setMessage("Invalid username or password.");
        } finally {
          setLoading(false);
        }
      },
    });
  
    const signupFormik = useFormik({
      initialValues: {
        username: "",
        email: "",
        password: "",
      },
      validationSchema: Yup.object({
        username: Yup.string()
          .min(3, "Username should be at least 3 characters")
          .required("Username is required"),
        email: Yup.string().email("Invalid email address").required("Email is required"),
        password: Yup.string()
          .min(6, "Password should be at least 6 characters")
          .required("Password is required"),
      }),
      onSubmit: async (values) => {
        setLoading(true);
        try {
          await axios.post("http://localhost:8000/api/v1/register", values);
          setMessage("Sign up successful! Redirecting to login...");
          setTimeout(() => {
            setIsLogin(true); // Switch to login form after signup
          }, 2000);
        } catch (error) {
          setMessage("Error occurred during sign up.");
        } finally {
          setLoading(false);
        }
      },
    });
  
    return (
      <Box sx={{ maxWidth: 400, mx: "auto", mt: 5 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          {isLogin ? "Login" : "Sign Up"}
        </Typography>
        <form onSubmit={isLogin ? loginFormik.handleSubmit : signupFormik.handleSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Username"
                name="username"
                value={isLogin ? loginFormik.values.username : signupFormik.values.username}
                onChange={isLogin ? loginFormik.handleChange : signupFormik.handleChange}
                onBlur={isLogin ? loginFormik.handleBlur : signupFormik.handleBlur}
                error={
                  isLogin
                    ? loginFormik.touched.username && Boolean(loginFormik.errors.username)
                    : signupFormik.touched.username && Boolean(signupFormik.errors.username)
                }
                helperText={
                  isLogin
                    ? loginFormik.touched.username && loginFormik.errors.username
                    : signupFormik.touched.username && signupFormik.errors.username
                }
              />
            </Grid>
            {!isLogin && (
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Email"
                  name="email"
                  type="email"
                  value={signupFormik.values.email}
                  onChange={signupFormik.handleChange}
                  onBlur={signupFormik.handleBlur}
                  error={signupFormik.touched.email && Boolean(signupFormik.errors.email)}
                  helperText={signupFormik.touched.email && signupFormik.errors.email}
                />
              </Grid>
            )}
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Password"
                name="password"
                type="password"
                value={isLogin ? loginFormik.values.password : signupFormik.values.password}
                onChange={isLogin ? loginFormik.handleChange : signupFormik.handleChange}
                onBlur={isLogin ? loginFormik.handleBlur : signupFormik.handleBlur}
                error={
                  isLogin
                    ? loginFormik.touched.password && Boolean(loginFormik.errors.password)
                    : signupFormik.touched.password && Boolean(signupFormik.errors.password)
                }
                helperText={
                  isLogin
                    ? loginFormik.touched.password && loginFormik.errors.password
                    : signupFormik.touched.password && signupFormik.errors.password
                }
              />
            </Grid>
            <Grid item xs={12}>
              <LoadingButton
                fullWidth
                variant="contained"
                color="primary"
                type="submit"
                loading={loading}
              >
                {isLogin ? "Login" : "Sign Up"}
              </LoadingButton>
            </Grid>
          </Grid>
        </form>
        {message && (
          <Typography color="error" sx={{ mt: 2 }}>
            {message}
          </Typography>
        )}
        <Button
          fullWidth
          variant="text"
          onClick={() => {
            setIsLogin(!isLogin);
            setMessage("");
          }}
          sx={{ mt: 2 }}
        >
          {isLogin ? "Don't have an account? Sign Up" : "Already have an account? Login"}
        </Button>
      </Box>
    );
  };

export default LoginSignup;
