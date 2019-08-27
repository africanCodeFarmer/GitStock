<?php
namespace app\project\controller;

use cmf\controller\HomeBaseController;
use think\Db;
use app\project\model\ProjectqueryModel;

class ProjectqueryController extends HomeBaseController
{
    //修改区开始
    private $tableName = "yg_project";

    public function getModel(){
        $Model = new ProjectqueryModel();
        return $Model;
    }

    //获取所有条件查询数组(免去getComposeMyWhere多个if) //compose组成
    public function getAllSearchWhere(){
        $allSearchWhere=['name','type_id','year','college_id'];
        return $allSearchWhere;
    }
    //修改区结束


    //查询功能
    public function searchTable(){    
        $Model = $this->getModel();

        //wantSelect数组里面[0=>'id','id'=>值]
        $wantSelect = $Model->getWantSelect();

        //多条件POST 组合成 myWhere数组 //(eg: $_POST['wantSelect['selectId']'],$_POST['wantSelect['selectTitle']'])
        $myWhere =[];

        //获取参与者或者负责人名字(支持模糊匹配)
        if($_POST['name']!="")
            $myWhere['name']=$_POST['name'];

        //根据wantSelect数组筛选POST组合myWhere
        for($i=0;$i<(count($wantSelect)/2);$i++){
            //未筛选条件默认为空
            if(strcmp($_POST["select".ucfirst($wantSelect[$i])], ''))
                $myWhere[$wantSelect[$i]]=$_POST["select".ucfirst($wantSelect[$i])];
        }

        $returnArray = $Model -> printTable($myWhere,1);
        return $this->backHtml($returnArray);
    }

    //myWhere数组用于+-go页保留多条件查询数组(防止换页就清空原来的多条件查询)
    public function getComposeMyWhere(){
        $myWhere =[];
        $allSearchWhere = $this->getAllSearchWhere();

        for($i=0;$i<count($allSearchWhere);$i++){
            $tempMyWhere = "myWhere".ucfirst($allSearchWhere[$i]);
            
            if(isset($_GET[$tempMyWhere])){
                if(!empty($_GET[$tempMyWhere]) || !strcmp($_GET[$tempMyWhere], '0'))
                    $myWhere[$allSearchWhere[$i]]=$_GET[$tempMyWhere];
            }
        }

        //""代表无条件查询 []代表条件查询
        if(empty($myWhere))
            $myWhere="";

        return $myWhere;
    }

    //print功能
    public function manageTable(){
        $Model = $this->getModel();
        $returnArray = $Model->printTable('');
        return $this->backHtml($returnArray);
    }

    //分页功能
    public function addTablePage(){
        $myWhere = $this->getComposeMyWhere();
        $Model = $this->getModel();

        $newPage = $_GET['pageCur']+1;
        $returnArray = $Model->printTable($myWhere,$newPage);
        return $this->backHtml($returnArray);
    }
    public function subTablePage(){
        $myWhere = $this->getComposeMyWhere();
        $Model = $this->getModel();

        $newPage = $_GET['pageCur']-1;
        $returnArray = $Model->printTable($myWhere,$newPage);
        return $this->backHtml($returnArray);
    }
    public function goTablePage(){
        $myWhere = $this->getComposeMyWhere();
        $Model = $this->getModel();

        $returnArray = $Model->printTable($myWhere,$_GET['goPageValue']);
        return $this->backHtml($returnArray);
    }

    public function backHtml($returnArray){
        $columns = $returnArray[0];
        $wantSelect = $returnArray[1];
        $useIdExchangeName = $returnArray[2];
        $page = $returnArray[3];
        $myWhereHandle = $returnArray[4];
        $myWhere = $returnArray[5];

        return $this->fetch('./project_query',["columns"=>$columns,"wantSelect"=>$wantSelect,"useIdExchangeName"=>$useIdExchangeName,"page"=>$page,"myWhereHandle"=>$myWhereHandle,"myWhere"=>$myWhere]);
    }
}