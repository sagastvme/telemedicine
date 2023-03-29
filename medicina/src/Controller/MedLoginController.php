<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;

class MedLoginController extends AbstractController
{
    #[Route('/login', name: 'ctrl_login')]
    public function index(Request $request): Response
    {
        return $this->render('med_login/index.html.twig');
    }


    #[Route('/logout', name: 'ctrl_logout')]
    public function logout()
    {
        return new Response();
    }


}
