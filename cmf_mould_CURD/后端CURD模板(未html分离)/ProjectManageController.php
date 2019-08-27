<?php

namespace app\project\controller;

use cmf\controller\HomeBaseController;

use think\Db;
use app\project\model\ProjectModel;

class ProjectManageController extends HomeBaseController
{
    //---修改区开始---
    private $tableName = "yg_project";

    public function getModal(){
        $Modal = new ProjectModel();
        return $Modal;
    }

    //获取所有条件查询数组(免去getsComposeMyWhere多个if)
    public function getAllSearchWhere(){
        $allSearchWhere=['id','title','type_id','year','college_id'];
        return $allSearchWhere;
    }
    //---修改区结束---
    


    //查询功能
    public function searchTable(){    
        $Model = $this->getModal();

        //wantSelect数组里面[0=>'id','id'=>值]
        $wantSelect = $Model->getWantSelect();

        //多条件POST 组合成 myWhere数组
            //(eg: $_POST['wantSelect['selectId']'],$_POST['wantSelect['selectTitle']'])
        $myWhere =[];

        //chooseSearchType是看选id还是title radioValue是对应的值
        if($_POST['radioValue']!="")
            $myWhere[$_POST['chooseSearchType']]=$_POST['radioValue'];

        //根据wantSelect数组筛选POST组合myWhere
        for($i=0;$i<(count($wantSelect)/2);$i++){
            //未筛选条件默认为X
            if(strcmp($_POST["select".ucfirst($wantSelect[$i])], 'X'))
                $myWhere[$wantSelect[$i]]=$_POST["select".ucfirst($wantSelect[$i])];
        }

        $Model -> printTable($myWhere,1);
    }
    
    //组合result数组 
        //为add和update功能服务(免去传入输入框的每个数据库插入值 eg: $_POST['inputID'],$_POST['inputTitle'])
    public function postsComposeResult(){
        $result =[];
        $columns = Db::table($this->tableName)->query("select COLUMN_NAME from information_schema.COLUMNS where table_name='".$this->tableName."'");

        for($i=0;$i<count($columns);$i++){
            if(!strcmp("id", $columns[$i]["COLUMN_NAME"])){
                $result['id']=$_POST['inputID'];
            }
            else{
                $tempName = "input".ucfirst($columns[$i]["COLUMN_NAME"]);
                $result[$columns[$i]["COLUMN_NAME"]]=$_POST[$tempName];
            }
        }

        return $result;
    }

    //myWhere数组用于 +-go页 保留 多条件查询数组(防止换页就清空原来的多条件查询)
    public function getsComposeMyWhere(){
        $myWhere =[];
        $allSearchWhere = $this->getAllSearchWhere();

        for($i=0;$i<count($allSearchWhere);$i++){
            $tempMyWhere = "myWhere".ucfirst($allSearchWhere[$i]);
            
            if(isset($_GET[$tempMyWhere])){
                if(!empty($_GET[$tempMyWhere]) || !strcmp($_GET[$tempMyWhere], '0'))
                    $myWhere[$allSearchWhere[$i]]=$_GET[$tempMyWhere];
            }
        }

        if(empty($myWhere))
            $myWhere="";

        return $myWhere;
    }

    //print功能
    public function manageTable(){
        $Model = $this->getModal();
        $Model->printTable('');
    }

    //删除功能
    public function deleteTable(){
        $Model = $this->getModal();
        $Model -> deleteTable($_POST['deleteID']);

        return $this->manageTable();
    }

    //添加功能
    public function addTable(){
        $Model = $this->getModal();

        $result = $this->postsComposeResult();
        $Model -> addTable($_POST['inputID'],$result);

        return $this->manageTable();
    }

    //编辑功能
    public function editTable(){
        $Model = $this->getModal();
        $Model -> editTable($_POST['editID']);

        $this->manageTable(); 
    }

    //修改功能
    public function updateTable(){ 
        $Model = $this->getModal();

        $result = $this->postsComposeResult();
        $Model -> updateTable($_POST['updateID'],$result);

        return $this->manageTable();
    }

    //分页功能
    public function addTablePage(){
        $myWhere = $this->getsComposeMyWhere();

        $newPage = $_GET['pageCur']+1;

        $Model = $this->getModal();
        $Model -> printTable($myWhere,$newPage);
    }
    public function subTablePage(){
        $myWhere = $this->getsComposeMyWhere();

        $newPage = $_GET['pageCur']-1;
        
        $Model = $this->getModal();
        $Model -> printTable($myWhere,$newPage);
    }
    public function goTablePage(){
        $myWhere = $this->getsComposeMyWhere();

        $Model = $this->getModal();
        $Model -> printTable($myWhere,$_GET['goPageValue']);
    }
}